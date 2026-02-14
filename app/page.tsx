"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Message, LatLng, ConnectionStatus } from '../types';
import { getCurrentLocation } from '../utils/geolocation';
import { MessageBubble } from '../components/MessageBubble';

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState<LatLng | null>(null);
    const [locStatus, setLocStatus] = useState<ConnectionStatus>('connecting');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial greeting
        setMessages([{
            id: 'init-1',
            role: 'model',
            text: '¡Hola! Soy tu guía de mapas avanzado. Dime qué buscas o dónde quieres ir, y te mostraré las mejores opciones directamente en Google Maps.',
            timestamp: new Date()
        }]);

        // Fetch location on mount
        const fetchLocation = async () => {
            try {
                const loc = await getCurrentLocation();
                setLocation(loc);
                setLocStatus('connected');
            } catch (error) {
                console.warn("Location access denied or failed", error);
                setLocStatus('denied');
            }
        };
        fetchLocation();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userText = input.trim();
        setInput('');

        const newMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: userText,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, newMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: userText,
                    location: location,
                }),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: data.text,
                timestamp: new Date(),
                groundingMetadata: data.groundingMetadata
            };

            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error(error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: "Lo siento, tuve problemas para conectar con el servicio de búsqueda. Por favor intenta de nuevo.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 relative">

            {/* Header */}
            <header className="flex-none bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-google-blue to-blue-600 rounded-full flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">GeoGuide AI</h1>
                        <p className="text-xs text-slate-500 font-medium">Powered by Gemini + Google Maps</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
                    <div className={`w-2 h-2 rounded-full ${locStatus === 'connected' ? 'bg-google-green animate-pulse' : locStatus === 'connecting' ? 'bg-google-yellow' : 'bg-slate-400'}`}></div>
                    <span className="text-xs font-semibold text-slate-600">
                        {locStatus === 'connected' ? 'GPS Activo' : locStatus === 'connecting' ? 'Localizando...' : 'Sin Ubicación'}
                    </span>
                </div>
            </header>

            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2">
                <div className="max-w-3xl mx-auto w-full pb-4">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                    {isLoading && (
                        <div className="flex w-full mb-6 justify-start animate-pulse">
                            <div className="bg-white px-5 py-4 rounded-2xl rounded-bl-sm border border-slate-100 shadow-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input Area */}
            <footer className="flex-none bg-white p-4 border-t border-slate-200">
                <div className="max-w-3xl mx-auto w-full relative">
                    <input
                        type="text"
                        className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-google-blue/20 focus:border-google-blue transition-all text-slate-800 placeholder:text-slate-400 shadow-inner"
                        placeholder="¿Qué buscas? (ej: Cafeterías cerca de Sol, Madrid)"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-2 bottom-2 aspect-square bg-google-blue hover:bg-blue-600 disabled:bg-slate-300 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
                <div className="max-w-3xl mx-auto w-full mt-2 text-center">
                    <p className="text-[10px] text-slate-400">
                        La IA puede cometer errores. Verifica la ubicación en Google Maps.
                    </p>
                </div>
            </footer>

        </div>
    );
}
