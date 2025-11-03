import React, { useEffect } from "react";
import html2canvas from "html2canvas";

export const ScreenshotShortcut = ({ targetId = "ROOT", shortcut = "KeyA", ctrl = true }) => {

    const takeScreenshot = async () => {
        const element = document.getElementById(targetId);
        if (!element) return;

        try {
            const canvas = await html2canvas(element, { backgroundColor: null });
            const dataURL = canvas.toDataURL("image/png");

            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "screenshot.png";
            link.click();
        } catch (err) {
            console.error("Errore nello screenshot:", err);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key.toLowerCase() === "a" && e.ctrlKey === ctrl) {
                e.preventDefault();
                takeScreenshot();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return null; // Non renderizza nulla
};
