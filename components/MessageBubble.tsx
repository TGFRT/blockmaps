import React from 'react';
import { Message } from '../types';
import { MapSourceCard } from './MapSourceCard';

interface MessageBubbleProps {
    message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.role === 'user';

    // Format text to handle basic newlines
    const formattedText = message.text.split('\n').map((line, i) => (
        <React.Fragment key={i}>
            {line}
            {i < message.text.split('\n').length - 1 && <br />}
        </React.Fragment>
    ));

    const mapChunks = message.groundingMetadata?.groundingChunks?.filter(c => c.maps) || [];

    return (
        <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>

                {/* Text Bubble */}
                <div
                    className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm
            ${isUser
                            ? 'bg-google-blue text-white rounded-br-sm'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                        }`}
                >
                    {formattedText}
                </div>

                {/* Map Cards (only for model) */}
                {!isUser && mapChunks.length > 0 && (
                    <div className="mt-3 w-full overflow-x-auto pb-2 -mx-1 px-1">
                        <div className="flex gap-3">
                            {mapChunks.map((chunk, index) => (
                                <MapSourceCard key={index} chunk={chunk} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Timestamp */}
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>

            </div>
        </div>
    );
};
