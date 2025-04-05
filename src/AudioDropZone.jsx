import React, { useState } from 'react';

export default function AudioDropzone() {
    const [audioFile, setAudioFile] = useState(null);

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];

        if (file && file.type.startsWith("audio/")) {
            setAudioFile(URL.createObjectURL(file));
        } else {
            alert("Please drop a valid audio file.");
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Needed to allow dropping
    };

    return (
        <div className="h-64 border-4 border-dashed border-blue-400 rounded-2xl p-4 bg-gray-900 text-white"
             onDrop={handleDrop}
             onDragOver={handleDragOver}
        >
            <p className="text-lg">Drag & drop your audio file here</p>
            {audioFile && (
                <audio controls className="mt-4 w-full max-w-md" />
            )}
        </div>
    );
}
