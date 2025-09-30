import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useCompletion } from "@ai-sdk/react";
import {
  generateResumeDataStore,
  useProjectData,
} from "@/stores/gnerate-reusme/generate-resume-p1";
import { useHistoryStore } from "@/stores/gnerate-reusme/editor-history";

export const useProjectManager = (
  resolvedParams: any,
  originalProjectId: any
) => {
  const { data, type } = generateResumeDataStore();
  const { htmlContent, setHtmlContent, setProjectId, projectId } =
    useProjectData();

  const { data: session, status } = useSession();
  const router = useRouter();

  const [isLocked, setIsLocked] = useState(false);
  const [count, setCount] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [ProjectDataLoading, setProjectDataLoading] = useState(false);

  const { addVersion, resetHistory } = useHistoryStore();
  const { permissionType, setPermissionType, setUrlPermission } =
    useProjectData();

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

        setHtmlContent(JSON.parse(res.data.project.html) || "");
        addVersion(JSON.parse(res.data.project.html) || "");
        setIsLocked(
          res.data.project.linkPermissionType === "LOCKED" ? true : false
        );
        setPermissionType(res.data.permissionType);
        setUrlPermission(res.data.project.linkPermissionType || "");
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

  // ! AI Resume Generation for "new" project
  useEffect(() => {
    console.log("originalProjectId", originalProjectId.current);
    console.log("status", status);
    console.log("data", data);
    if (
      originalProjectId.current !== "new" ||
      status === "loading" ||
      apiIsCalled.current
    )
      return;

    apiIsCalled.current = true;

    console.log("Type", type);

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
    if (permissionType !== "EDIT") {
      toast.error("You are not authorized to save this project.");
      return;
    }
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
    if (!resumeRef.current) {
      toast.error("Resume content is not available to download.");
      return;
    }
    setIsDownloading(true);

    const html = `
              <html>
                <head>
                  <meta charset="utf-8">
                </head>
                <body>
                  ${resumeRef.current.innerHTML}
                </body>
              </html>`;

    const resp = await fetch("/api/generate-html/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html, filename: "resume.pdf" }),
    });

    if (!resp.ok) throw new Error("PDF generation failed");

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
    isLocked,
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
