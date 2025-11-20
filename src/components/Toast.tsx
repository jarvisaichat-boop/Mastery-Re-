import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        
        return () => clearTimeout(timer);
    }, [onClose]);
    
    return (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn">
            <div className="bg-gray-800 border border-gray-700 rounded-lg px-6 py-4 shadow-2xl">
                <p className="text-white text-center text-sm">{message}</p>
            </div>
        </div>
    );
};
