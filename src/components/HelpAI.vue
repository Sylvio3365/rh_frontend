<template>
    <div class="help-ai-container">
        <!-- Bouton d'ouverture du chat -->
        <button @click="toggleChat" :class="[
            'ai-chat-button',
            isOpen ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg'
        ]" :title="isOpen ? 'Fermer l\'assistant' : 'Ouvrir l\'assistant IA'">
            <Icon v-if="!isOpen" icon="fluent:chat-help-24-regular" class="text-xl" />
            <Icon v-else icon="heroicons:x-mark-20-solid" class="text-xl" />
        </button>

        <!-- Fenêtre de chat -->
        <transition name="chat-slide">
            <div v-if="isOpen" class="ai-chat-window">
                <!-- En-tête du chat -->
                <div class="chat-header">
                    <div class="flex items-center space-x-3">
                        <div
                            class="w-10 h-10 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center">
                            <Icon icon="fluent:bot-24-regular" class="text-white text-lg" />
                        </div>
                        <div>
                            <h3 class="font-semibold text-lg text-gray-900 dark:text-white">Assistant RH</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                {{ isConnected ? 'En ligne' : 'Hors ligne' }}
                                <span :class="isConnected ? 'text-green-500' : 'text-red-500'">•</span>
                            </p>
                        </div>
                    </div>
                    <button @click="toggleChat"
                        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <Icon icon="heroicons:x-mark-20-solid" class="text-2xl" />
                    </button>
                </div>

                <!-- Zone des messages -->
                <div ref="messagesContainer" class="chat-messages">
                    <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
                        <div v-if="message.type === 'bot'" class="message-avatar">
                            <div
                                class="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center">
                                <Icon icon="fluent:bot-24-regular" class="text-white text-sm" />
                            </div>
                        </div>
                        <div class="message-content">
                            <div :class="['message-bubble', message.type === 'user' ? 'user-bubble' : 'bot-bubble']">
                                <!-- Rendu des URLs cliquables -->
                                <div v-if="message.type === 'bot' && containsURL(message.text)"
                                    class="rich-text-content" v-html="formatMessageWithLinks(message.text)">
                                </div>
                                <div v-else>
                                    {{ message.text }}
                                </div>
                            </div>
                            <span class="message-time">{{ message.time }}</span>
                        </div>
                    </div>

                    <!-- Indicateur de frappe -->
                    <div v-if="isTyping" class="message bot">
                        <div class="message-avatar">
                            <div
                                class="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center">
                                <Icon icon="fluent:bot-24-regular" class="text-white text-sm" />
                            </div>
                        </div>
                        <div class="message-content">
                            <div class="bot-bubble typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>

                    <!-- Message d'erreur -->
                    <div v-if="errorMessage" class="message bot">
                        <div class="message-avatar">
                            <div
                                class="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                                <Icon icon="heroicons:exclamation-triangle-20-solid" class="text-white text-sm" />
                            </div>
                        </div>
                        <div class="message-content">
                            <div class="bot-bubble error-bubble">
                                {{ errorMessage }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Zone de saisie -->
                <div class="chat-input">
                    <div class="relative">
                        <input v-model="userInput" @keypress.enter="sendMessage" type="text"
                            placeholder="Posez votre question..."
                            class="w-full p-4 pr-14 text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-3 focus:ring-primary focus:border-transparent dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                            :disabled="isTyping || !isConnected" />
                        <button @click="sendMessage" :disabled="!userInput.trim() || isTyping || !isConnected"
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 p-2.5 text-primary hover:text-primary/80 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors">
                            <Icon icon="heroicons:paper-airplane-20-solid" class="text-2xl" />
                        </button>
                    </div>
                    <p v-if="!isConnected" class="text-sm text-red-500 dark:text-red-400 mt-3 text-center">
                        ⚠️ L'assistant est temporairement hors ligne
                    </p>
                    <p v-else class="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                        Assistant IA • Connexion active à l'API
                    </p>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
    name: "HelpAI",
    components: {
        Icon,
    },
    data() {
        return {
            isOpen: false,
            userInput: "",
            isTyping: false,
            isConnected: true,
            errorMessage: "",
            apiUrl: "http://127.0.0.1:2026/ask/",
            messages: [
                {
                    type: "bot",
                    text: "Bonjour ! Je suis votre assistant IA pour l'ERP RH. Comment puis-je vous aider aujourd'hui ?",
                    time: this.getCurrentTime()
                }
            ]
        };
    },
    methods: {
        async sendMessage() {
            if (!this.userInput.trim() || this.isTyping || !this.isConnected) return;

            const userMessage = {
                type: "user",
                text: this.userInput,
                time: this.getCurrentTime()
            };

            this.messages.push(userMessage);
            const userQuestion = this.userInput;
            this.userInput = "";
            this.errorMessage = "";

            this.scrollToBottom();

            // Appel à l'API
            this.isTyping = true;
            await this.getAIResponse(userQuestion);
            this.isTyping = false;
            this.scrollToBottom();
        },

        async getAIResponse(question) {
            try {
                console.log("Question envoyée:", question);
                const response = await fetch(`${this.apiUrl}?question=${encodeURIComponent(question)}`, {
                    headers: {
                        'Accept': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                // Parser le JSON
                const data = await response.json();
                console.log("Réponse JSON reçue:", data);

                // Extraire le contenu de la réponse
                const responseText = data.response || data.answer || data.message ||
                    "Je n'ai pas pu comprendre la réponse de l'assistant.";

                console.log("Texte à afficher:", responseText);

                // Ajouter la réponse au chat
                this.messages.push({
                    type: "bot",
                    text: responseText,
                    time: this.getCurrentTime()
                });

                // Réactiver la connexion si elle était désactivée
                if (!this.isConnected) {
                    this.isConnected = true;
                    this.errorMessage = "";
                }

            } catch (error) {
                console.error("Erreur API:", error);

                // Désactiver la connexion
                this.isConnected = false;

                // Message d'erreur
                this.errorMessage = "L'assistant est temporairement indisponible.";

                // Message de secours
                this.messages.push({
                    type: "bot",
                    text: "Je suis désolé, je rencontre des difficultés de connexion. Voici quelques informations utiles :\n\n• Gestion des congés : Consultez le module Congés\n• Employés : Accédez à la liste des employés\n• Postes : Voir les postes disponibles",
                    time: this.getCurrentTime()
                });
            }
        },

        // Vérifie si le texte contient une URL
        containsURL(text) {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            return urlRegex.test(text);
        },

        // Formate le texte pour rendre les URLs cliquables
        formatMessageWithLinks(text) {
            if (!text) return text;

            // Remplacer les URLs par des liens cliquables
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const formattedText = text.replace(urlRegex, (url) => {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 underline font-medium">${url}</a>`;
            });

            // Remplacer les retours à la ligne par des balises <br>
            return formattedText.replace(/\n/g, '<br>');
        },

        async testConnection() {
            try {
                const response = await fetch(`${this.apiUrl}?question=test`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.response || data.answer || data.message) {
                        this.isConnected = true;
                        this.errorMessage = "";
                    }
                }
            } catch (error) {
                console.log("Connexion indisponible");
            }
        },

        toggleChat() {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
                this.testConnection();
            }
        },

        getCurrentTime() {
            return new Date().toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        scrollToBottom() {
            this.$nextTick(() => {
                const container = this.$refs.messagesContainer;
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            });
        }
    },
    mounted() {
        document.addEventListener('click', (event) => {
            const helpAI = this.$el;
            if (this.isOpen && !helpAI.contains(event.target)) {
                this.isOpen = false;
            }
        });

        this.testConnection();
    }
};
</script>

<style scoped>
.help-ai-container {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 10000;
}

.ai-chat-button {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
    outline: none;
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 10001;
}

.ai-chat-button:hover {
    transform: scale(1.08);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
}

.ai-chat-window {
    position: fixed;
    bottom: 120px;
    right: 30px;
    width: 480px;
    height: 650px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 10002;
}

.dark .ai-chat-window {
    background: #1f2937;
    border-color: #374151;
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
}

.dark .chat-header {
    background: #111827;
    border-color: #374151;
}

.chat-messages {
    flex: 1;
    padding: 20px 24px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: white;
}

.dark .chat-messages {
    background: #1f2937;
}

.message {
    display: flex;
    gap: 12px;
}

.message.user {
    justify-content: flex-end;
}

.message.bot {
    justify-content: flex-start;
}

.message-avatar {
    flex-shrink: 0;
    margin-top: 6px;
}

.message-content {
    max-width: 85%;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.message.user .message-content {
    align-items: flex-end;
}

.message-bubble {
    padding: 14px 18px;
    border-radius: 20px;
    line-height: 1.5;
    white-space: pre-line;
    word-wrap: break-word;
    font-size: 15px;
}

.user-bubble {
    background: #4f46e5;
    color: white;
    border-bottom-right-radius: 8px;
}

.bot-bubble {
    background: #f3f4f6;
    color: #374151;
    border-bottom-left-radius: 8px;
}

.dark .bot-bubble {
    background: #374151;
    color: #f3f4f6;
}

/* Style pour le contenu riche avec liens */
.rich-text-content {
    line-height: 1.6;
}

.rich-text-content a {
    color: #4f46e5;
    text-decoration: underline;
    font-weight: 500;
    transition: color 0.2s;
}

.rich-text-content a:hover {
    color: #4338ca;
}

.dark .rich-text-content a {
    color: #818cf8;
}

.dark .rich-text-content a:hover {
    color: #6366f1;
}

.error-bubble {
    background: #fee2e2;
    color: #dc2626;
    border: 1px solid #fca5a5;
    font-size: 14px;
}

.dark .error-bubble {
    background: #7f1d1d;
    color: #fca5a5;
    border-color: #991b1b;
}

.message-time {
    font-size: 12px;
    color: #9ca3af;
    padding: 0 4px;
}

.typing-indicator {
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 14px 20px;
}

.typing-indicator span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #9ca3af;
    animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
    animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {

    0%,
    60%,
    100% {
        transform: translateY(0);
    }

    30% {
        transform: translateY(-5px);
    }
}

.chat-input {
    padding: 20px 24px;
    border-top: 1px solid #e5e7eb;
    background: #f9fafb;
}

.dark .chat-input {
    background: #111827;
    border-color: #374151;
}

/* Animations */
.chat-slide-enter-active,
.chat-slide-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-slide-enter-from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
}

.chat-slide-leave-to {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
}

/* Scrollbar personnalisée */
.chat-messages::-webkit-scrollbar {
    width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.dark .chat-messages::-webkit-scrollbar-track {
    background: #374151;
}

.chat-messages::-webkit-scrollbar-thumb {
    background: #c5c5c5;
    border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

.dark .chat-messages::-webkit-scrollbar-thumb {
    background: #6b7280;
}

.dark .chat-messages::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}

/* Responsive */
@media (max-width: 768px) {
    .ai-chat-window {
        width: calc(100vw - 60px);
        height: 550px;
        right: 30px;
        left: 30px;
    }

    .ai-chat-button {
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
    }

    .ai-chat-window {
        bottom: 100px;
        right: 20px;
        left: 20px;
    }
}

@media (max-width: 480px) {
    .ai-chat-window {
        width: calc(100vw - 40px);
        height: 500px;
        right: 20px;
        left: 20px;
    }

    .chat-messages {
        padding: 16px;
    }

    .chat-input {
        padding: 16px;
    }
}
</style>