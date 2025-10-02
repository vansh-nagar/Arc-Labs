import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useCompletion } from "@ai-sdk/react";
import { generateResumeDataStore } from "@/stores/gnerate-reusme/generate-resume-p1";
import { useProjectData } from "@/stores/gnerate-reusme/project-data-store";
import { useHistoryStore } from "@/stores/gnerate-reusme/editor-history";
import { LinkPermissionType } from "@prisma/client";

export const useProjectManager = (
  resolvedParams: any,
  originalProjectId: any
) => {
  const { data, type } = generateResumeDataStore();
  const {
    htmlContent,
    setHtmlContent,
    setProjectId,
    setUrlPermission,
    setIsOwner,
    projectId,
    setLinkExpiresAt,
  } = useProjectData();

  const { data: session, status } = useSession();
  const router = useRouter();

  const [count, setCount] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [ProjectDataLoading, setProjectDataLoading] = useState(false);

  const { addVersion, resetHistory } = useHistoryStore();

  const apiIsCalled = useRef(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const { completion, error, complete } = useCompletion({
    api: "/api/generate-html/manual",
  });

  //! on mount
  //? set projectId from route
  useEffect(() => {
    resetHistory();
    setProjectId(resolvedParams["project-id"]);
  }, [resolvedParams]);

  //? sync completion
  useEffect(() => {
    setHtmlContent(completion || "");
  }, [completion]);

  // ! Project Fetching
  useEffect(() => {
    console.log("ProjectId changed, fetching data:", projectId);
    if (
      !projectId ||
      projectId === "new" ||
      status !== "authenticated" ||
      ProjectDataLoading
    )
      return;

    setProjectDataLoading(true);

    axios
      .post("/api/generate-html/update-project-view", { projectId })
      .then((res) => setCount(res.data.data));

    axios
      .post("/api/generate-html/get-project-data", {
        projectId,
        fetcherEmail: session?.user?.email,
      })
      .then((res) => {
        console.log("Fetched project data:", res.data);
        setHtmlContent(JSON.parse(res.data.projectData.html) || "");
        addVersion(JSON.parse(res.data.projectData.html) || "");
        setIsOwner(res.data.isOwner);
        setUrlPermission(res.data.urlPermission);
        setLinkExpiresAt(res.data.projectData.linkExpiresAt);

        toast.success(res.data.message || "Project data loaded.");
      })
      .catch((err) =>
        toast.error(
          err?.response?.data?.error || "Failed to fetch project data."
        )
      )
      .finally(() => {
        setProjectDataLoading(false);
      });
  }, [projectId, status]);

  useEffect(() => {
    if (
      originalProjectId.current !== "new" ||
      status === "loading" ||
      apiIsCalled.current
    )
      return;

    apiIsCalled.current = true;

    setHtmlContent("");
    setProjectId("");

    if (type === "template" && data.template !== "") {
      setHtmlContent(data.template);
      toast.success("Template applied successfully!");
      axios
        .post("/api/generate-html/save-to-db", {
          htmlContent: data.template,
          email: session?.user?.email,
        })
        .then((res) => {
          if (res.status === 200) {
            setProjectId(res.data.projectId);
            router.replace(
              `/dashboard/generate-resume/page2/${res.data.projectId}`
            );
            toast.success(res.data.message || "Resume saved successfully.");
          }
        })
        .catch((err) =>
          toast.error(err?.response?.data?.error || "Failed to save resume.")
        )
        .finally(() => {
          apiIsCalled.current = false;
        });
      return;
    }

    complete(JSON.stringify(data)).then(() => {
      apiIsCalled.current = false;
      axios
        .post("/api/generate-html/save-to-db", {
          htmlContent: resumeRef.current?.innerHTML,
          email: session?.user?.email,
        })
        .then((res) => {
          if (res.status === 200) {
            setProjectId(res.data.projectId);
            router.replace(
              `/dashboard/generate-resume/page2/${res.data.projectId}`
            );
            toast.success(res.data.message || "Resume saved successfully.");
          }
        })
        .catch((err) =>
          toast.error(err?.response?.data?.error || "Failed to save resume.")
        );
    });
  }, [status]);

  //! Save progress
  const handleSaveProgress = async () => {
    if (isSavingToDb) return;
    setIsSavingToDb(true);

    axios
      .post("/api/generate-html/update-project-html", {
        htmlContent,
        projectId,
      })
      .then((res) => {
        toast.success(res.data.message || "Project updated successfully.");
      })
      .catch((err) =>
        toast.error(err?.response?.data?.error || "Failed to update project.")
      )
      .finally(() => {
        setIsSavingToDb(false);
      });
  };

  //!download PDF
  const handleDownloadPDF = async () => {
    if (!htmlContent) {
      toast.error("Resume content is not available to download.");
      return;
    }

    console.log("downloading");
    console.log(htmlContent);

    setIsDownloading(true);

    const resp = await fetch("/api/generate-html/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html: `${htmlContent}`, filename: "resume.pdf" }),
    });

    if (!resp.ok) {
      throw new Error("PDF generation failed");
    }

    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    a.click();
    URL.revokeObjectURL(url);
    setIsDownloading(false);
  };

  return {
    // state
    projectId,
    count,
    showCode,
    setShowCode,
    isSavingToDb,
    isDownloading,
    error,
    htmlContent,
    setHtmlContent,
    resumeRef,
    completion,
    // handlers
    handleSaveProgress,
    handleDownloadPDF,
  };
};
