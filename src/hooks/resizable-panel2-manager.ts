import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useCompletion } from "@ai-sdk/react";
import {
  generateResumeDataStore,
  useHTMLEditorStore,
} from "@/stores/generate_resume_p1";

export const useProjectManager = (
  resolvedParams: any,
  originalProjectId: any
) => {
  const { data, type } = generateResumeDataStore();
  const { htmlContent, setHtmlContent } = useHTMLEditorStore();

  const { data: session, status } = useSession();
  const router = useRouter();

  const [projectId, setProjectId] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [count, setCount] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isToggleLock, setIsToggleLock] = useState(false);

  const updateFunctionCalled = useRef(false);
  const apiIsCalled = useRef(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const { completion, error, complete } = useCompletion({
    api: "/api/generate-html/manual",
  });

  // set projectId from route
  useEffect(() => {
    setProjectId(resolvedParams["project-id"]);
  }, [resolvedParams]);

  // sync completion
  useEffect(() => {
    setHtmlContent(completion || "");
  }, [completion]);

  // fetch project data
  useEffect(() => {
    if (
      !projectId ||
      projectId === "new" ||
      updateFunctionCalled.current ||
      status !== "authenticated"
    )
      return;

    updateFunctionCalled.current = true;

    axios
      .post("/api/generate-html/update-project-view", { projectId })
      .then((res) => setCount(res.data.data));

    axios
      .post("/api/generate-html/get-project-data", { projectId })
      .then((res) => {
        setHtmlContent(JSON.parse(res.data.project.html) || "");
        setIsLocked(res.data.project.locked);
        if (res.data.project.user.email === session?.user?.email) {
          setIsAuthenticated(true);
        }
        toast.success(res.data.message || "Project data loaded.");
      })
      .catch((err) =>
        toast.error(
          err?.response?.data?.error || "Failed to fetch project data."
        )
      )
      .finally(() => {
        updateFunctionCalled.current = false;
      });
  }, [projectId, status]);

  // auto generate resume if new
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

    console.log("Generating resume with dataaaaaaaaaaaaaaaaaaa", type);

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

  useEffect(() => {
    console.log("typeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", type);
  }, []);

  const handleSaveProgress = async () => {
    if (!isAuthenticated) {
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
        if (res.status === 200) {
          toast.success(res.data.message || "Project updated successfully.");
        }
      })
      .catch((err) =>
        toast.error(err?.response?.data?.error || "Failed to update project.")
      )
      .finally(() => {
        setIsSavingToDb(false);
      });
  };

  const handleToggleLockProject = async (lockState: boolean) => {
    if (isToggleLock) return;
    if (!isAuthenticated) {
      toast.error("You are not authorized to lock/unlock this project.");
      return;
    }
    setIsToggleLock(true);

    axios
      .post("/api/generate-html/toggle-lock-project", {
        projectId,
        lockState,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message || "Project lock state updated.");
        }
      })
      .catch((err) =>
        toast.error(
          err?.response?.data?.error || "Failed to update lock state."
        )
      )
      .finally(() => {
        setIsToggleLock(false);
      });
  };

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
    setIsLocked,
    isAuthenticated,
    setIsAuthenticated,
    count,
    showCode,
    setShowCode,
    isSavingToDb,
    isDownloading,
    isToggleLock,
    error,
    htmlContent,
    setHtmlContent,
    resumeRef,
    completion,
    // handlers
    handleSaveProgress,
    handleToggleLockProject,
    handleDownloadPDF,
  };
};
