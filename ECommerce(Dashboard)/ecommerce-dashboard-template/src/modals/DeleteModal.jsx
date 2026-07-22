import React from "react";
import { X, AlertTriangle } from "lucide-react";

const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-md flex justify-center items-center p-4 animate-fade-in">
      <div className="glass-panel w-full max-w-sm p-7 relative border-border shadow-2xl shadow-black/40 animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-secondary p-1.5 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mb-5 border border-destructive/20">
            <AlertTriangle size={26} />
          </div>
          <h2 className="text-lg font-extrabold mb-2 text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground mb-7 leading-relaxed">{message}</p>
          
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-destructive hover:bg-destructive/90 text-white transition-all active:scale-95"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
