import React from 'react';

interface AlertProps {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
    const bgColor = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-amber-50 border-amber-200 text-amber-800',
    };

    const iconMap = {
        success: '✓',
        error: '⚠️',
        info: 'ℹ️',
        warning: '⚡',
    };

    return (
        <div className={`border px-4 py-3 rounded-lg mb-4 flex items-center shadow-sm ${bgColor[type]}`} role="alert">
            <span className="mr-3 text-lg">{iconMap[type]}</span>
            <div className="flex-1 text-sm font-medium">
                {message}
            </div>
            {onClose && (
                <button onClick={onClose} className="ml-3 text-xl font-bold opacity-50 hover:opacity-100 transition-opacity">
                    &times;
                </button>
            )}
        </div>
    );
};

export default Alert;
