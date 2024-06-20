"use client";

import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect } from "react";

type Props = {
  children?: React.ReactNode;
  showCloseButton?: boolean;
  onClose?: () => void;
  closeOnBackdropClick?: boolean;
  closeOnEscapeKey?: boolean;
  className?: string;
  title?: string;
  description?: string;
};

const OverlayMessageBox: React.FC<Props> = ({
  children,
  showCloseButton = false,
  onClose,
  closeOnBackdropClick = false,
  closeOnEscapeKey = false,
  className = "",
  title,
  description,
}) => {
  const handleBackdropClick = () => {
    onClose && onClose();
  };

  useEffect(() => {
    if (closeOnEscapeKey) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose && onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [closeOnEscapeKey, onClose]);

  return (
    <div
      className="bg-background/80 w-full fixed h-full backdrop-blur-sm flex justify-center items-center"
      onClick={closeOnBackdropClick ? handleBackdropClick : undefined}
    >
      <Card className="backdrop-blur-sm bg-muted-foreground/20 relative">
        {showCloseButton && (
          <Button
            className="absolute -top-2 -right-2 w-6 h-6 p-1 rounded-full"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </Button>
        )}
        <div className="p-4">
          {children ? (
            children
          ) : (
            <>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-sm mt-2 max-w-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OverlayMessageBox;
