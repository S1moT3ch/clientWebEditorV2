import React, { useEffect } from "react";
import html2canvas from "html2canvas";

export const ScreenshotShortcut = ({ targetId = "ROOT", shortcut = "KeyA", ctrl = true }) => {

    const takeScreenshot = async () => {
        const element = document.getElementById(targetId);
        if (!element) return;

        try {

            const originalScrollY = window.scrollY;
            const originalScrollX = window.scrollX;

            window.scrollTo(0, 0);

            const rect = element.getBoundingClientRect();
            const canvas = await html2canvas(element, {
                backgroundColor: "#ffffff",
                scale: 2, //aumenta la qualità
                useCORS: true,
                removeContainer: true,
                logging: false,
                scrollX: -window.scrollX,
                scrollY: -window.scrollY,
                width: rect.width,
                height: rect.height,
            });

            window.scrollTo(originalScrollX, originalScrollY);

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
    }, [shortcut, ctrl]);

    return null;
};
