import { useProjectData } from "@/stores/gnerate-reusme/generate-resume-p1";

export const useEditorManager = (editor: any) => {
  const { setHtmlContent } = useProjectData();

  const handleOnEditorDidMount = (editor: any) => {
    editor.onDidScrollChange((e: any) => {
      const scrollTop = editor.getScrollTop(); // vertical scroll
      const scrollLeft = editor.getScrollLeft(); // horizontal scroll

      localStorage.setItem("editorScrollTop", scrollTop.toString());
      localStorage.setItem("editorScrollLeft", scrollLeft.toString());
    });

    editor.onDidChangeModelContent((e: any) => {
      console.log("Content changed:", e);
    });

    const savedTop = localStorage.getItem("editorScrollTop");
    const savedLeft = localStorage.getItem("editorScrollLeft");
    if (savedTop && savedLeft) {
      editor.setScrollPosition({
        scrollTop: Number(savedTop),
        scrollLeft: Number(savedLeft),
      });
    }
  };

  return { handleOnEditorDidMount };
};
