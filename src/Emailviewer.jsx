import React, { useEffect, useState } from "react";
import axios from "axios";

const Emailviewer = () => {
    const [fullQuery, setFullQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [emailData, setEmailData] = useState(null);

    useEffect(() => {
        // Extract the raw query string
        const rawQuery = window.location.search.substring(1); // Remove '?'
        
        // Find the "url=" position and extract everything after it
        const urlIndex = rawQuery.indexOf("url=");
        if (urlIndex === -1) {
            setError("No URL parameter found");
            return;
        }

        const extractedUrl = decodeURIComponent(rawQuery.substring(urlIndex + 4)); // Extract after 'url='
        setFullQuery(extractedUrl);

        // Send extracted URL to backend
        setLoading(true);
        axios.post("https://temp-backend-six.vercel.app/upload", { url: extractedUrl })
            .then(response => {
                setEmailData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching email data:", error);
                setError("Failed to fetch email data");
                setLoading(false);
            });

    }, []);

    const downloadAttachment = (attachment) => {
        try {
            const byteCharacters = atob(attachment.content);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([byteNumbers], { type: attachment.contentType });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = attachment.filename;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("Error downloading attachment:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">📧 Email Viewer</h2>

            {loading && <p className="text-blue-500 text-lg">Loading...</p>}
            {error && <p className="text-red-500 text-lg">{error}</p>}

            {emailData && (
                <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-[90%]">
                    <p className="text-gray-700"><strong>To:</strong> {emailData.to}</p>
                    <p className="text-gray-700"><strong>From:</strong> {emailData.from}</p>
                    <p className="text-gray-700"><strong>Subject:</strong> {emailData.subject}</p>
                    <p className="text-gray-500 text-sm"><strong>Date:</strong> {emailData.date}</p>
                    <p className="text-gray-500 text-sm"><strong>CC:</strong> {emailData.cc || "N/A"}</p>
                    <p className="text-gray-500 text-sm"><strong>BCC:</strong> {emailData.bcc || "N/A"}</p>

                    <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                        <h3 className="text-lg font-semibold mb-2">📜 Email Body:</h3>
                        <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: emailData.body }} />
                    </div>

                    {/* Attachments Section */}
                    {emailData.attachments?.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold mb-3">📎 Attachments:</h3>
                            <ul className="space-y-2">
                                {emailData.attachments.map((attachment, index) => (
                                    <li key={index} className="flex items-center space-x-3">
                                        <button
                                            onClick={() => downloadAttachment(attachment)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
                                        >
                                            {attachment.filename}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Emailviewer;
