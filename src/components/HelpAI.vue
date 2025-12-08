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
                            class="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center">
                            <Icon icon="fluent:bot-24-regular" class="text-white text-sm" />
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900 dark:text-white">Assistant RH</h3>
                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                {{ isConnected ? 'En ligne' : 'Hors ligne' }}
                                <span :class="isConnected ? 'text-green-500' : 'text-red-500'">•</span>
                            </p>
                        </div>
                    </div>
                    <button @click="toggleChat"
                        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <Icon icon="heroicons:x-mark-20-solid" class="text-xl" />
                    </button>
                </div>

                <!-- Zone des messages -->
                <div ref="messagesContainer" class="chat-messages">
                    <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
                        <div v-if="message.type === 'bot'" class="message-avatar">
                            <div
                                class="w-6 h-6 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center">
                                <Icon icon="fluent:bot-24-regular" class="text-white text-xs" />
                            </div>
                        </div>
                        <div class="message-content">
                            <div :class="['message-bubble', message.type === 'user' ? 'user-bubble' : 'bot-bubble']">
                                {{ message.text }}
                            </div>
                            <span class="message-time">{{ message.time }}</span>
                        </div>
                    </div>

                    <!-- Indicateur de frappe -->
                    <div v-if="isTyping" class="message bot">
                        <div class="message-avatar">
                            <div
                                class="w-6 h-6 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center">
                                <Icon icon="fluent:bot-24-regular" class="text-white text-xs" />
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
                                class="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                                <Icon icon="heroicons:exclamation-triangle-20-solid" class="text-white text-xs" />
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
                            class="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                            :disabled="isTyping || !isConnected" />
                        <button @click="sendMessage" :disabled="!userInput.trim() || isTyping || !isConnected"
                            class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary hover:text-primary/80 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors">
                            <Icon icon="heroicons:paper-airplane-20-solid" class="text-xl" />
                        </button>
                    </div>
                    <p v-if="!isConnected" class="text-xs text-red-500 dark:text-red-400 mt-2 text-center">
                        ⚠️ L'assistant est temporairement hors ligne
                    </p>
                    <p v-else class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
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
            apiUrl: "http://127.0.0.1:2025/ask/",
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
                console.log("Envoi de la question à l'API:", question);
                const response = await fetch(`${this.apiUrl}?question=${encodeURIComponent(question)}`);

                console.log("Statut de la réponse:", response.status);

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                // Obtenir le texte brut de la réponse
                const responseText = await response.text();
                console.log("Réponse brute de l'API:", responseText);

                // Extraire la réponse du format "response `message`"
                let extractedResponse = this.extractResponseFromText(responseText);

                console.log("Réponse extraite:", extractedResponse);

                // Ajouter la réponse au chat
                this.messages.push({
                    type: "bot",
                    text: extractedResponse,
                    time: this.getCurrentTime()
                });

                // Réactiver la connexion si elle était désactivée
                if (!this.isConnected) {
                    this.isConnected = true;
                }

            } catch (error) {
                console.error("Erreur API:", error);

                // Désactiver la connexion
                this.isConnected = false;

                // Message d'erreur
                this.errorMessage = `Impossible de se connecter à l'assistant. L'API est hors ligne ou inaccessible.`;

                // Optionnel : ajouter un message de secours
                this.messages.push({
                    type: "bot",
                    text: "Je suis désolé, je rencontre des difficultés techniques. Voici quelques informations utiles :\n\n• Gestion des congés : Consultez le module Congés\n• Employés : Accédez à la liste des employés\n• Postes : Voir les postes disponibles\n• Contactez le support pour plus d'aide",
                    time: this.getCurrentTime()
                });
            }
        },

        // Méthode pour extraire la réponse du format texte
        extractResponseFromText(text) {
            // Vérifier si le texte correspond au format "response `message`"
            const pattern = /response\s+`([^`]+)`/;
            const match = text.match(pattern);

            if (match && match[1]) {
                // Nettoyer et formater la réponse
                return match[1]
                    .replace(/\\n/g, '\n')  // Convertir \n en sauts de ligne réels
                    .replace(/\\t/g, '  ')   // Convertir \t en espaces
                    .trim();
            }

            // Si le format n'est pas reconnu, essayer d'autres patterns
            if (text.includes('`')) {
                // Essayer d'extraire tout ce qui est entre backticks
                const backtickMatch = text.match(/`([^`]+)`/);
                if (backtickMatch && backtickMatch[1]) {
                    return backtickMatch[1]
                        .replace(/\\n/g, '\n')
                        .replace(/\\t/g, '  ')
                        .trim();
                }
            }

            // Si aucun pattern ne correspond, retourner le texte tel quel
            return text
                .replace(/\\n/g, '\n')
                .replace(/\\t/g, '  ')
                .trim();
        },

        // Méthode alternative si l'API retourne du JSON
        async getAIResponseJSON(question) {
            try {
                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        question: question,
                        context: "ERP RH"
                    })
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const data = await response.json();

                let responseText;
                if (data.response) {
                    responseText = data.response;
                } else if (data.answer) {
                    responseText = data.answer;
                } else if (data.message) {
                    responseText = data.message;
                } else {
                    responseText = "Réponse de l'assistant.";
                }

                this.messages.push({
                    type: "bot",
                    text: responseText,
                    time: this.getCurrentTime()
                });

            } catch (error) {
                console.error("Erreur API:", error);
                this.handleApiError();
            }
        },

        handleApiError() {
            this.isConnected = false;
            this.errorMessage = "Service temporairement indisponible";

            // Réessayer après 30 secondes
            setTimeout(() => {
                this.testConnection();
            }, 30000);
        },

        async testConnection() {
            try {
                const response = await fetch(`${this.apiUrl}?question=test`);
                if (response.ok) {
                    this.isConnected = true;
                    this.errorMessage = "";
                }
            } catch (error) {
                console.log("Connexion toujours indisponible");
            }
        },

        toggleChat() {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
                // Tester la connexion quand on ouvre le chat
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
        // Fermer le chat en cliquant à l'extérieur
        document.addEventListener('click', (event) => {
            const helpAI = this.$el;
            if (this.isOpen && !helpAI.contains(event.target)) {
                this.isOpen = false;
            }
        });

        // Tester la connexion au démarrage
        this.testConnection();
    }
};
</script>

<style scoped>
.help-ai-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
}

.ai-chat-button {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
    outline: none;
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10001;
}

.ai-chat-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.ai-chat-window {
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 380px;
    height: 500px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
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
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
}

.dark .chat-header {
    background: #111827;
    border-color: #374151;
}

.chat-messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: white;
}

.dark .chat-messages {
    background: #1f2937;
}

.message {
    display: flex;
    gap: 8px;
}

.message.user {
    justify-content: flex-end;
}

.message.bot {
    justify-content: flex-start;
}

.message-avatar {
    flex-shrink: 0;
    margin-top: 4px;
}

.message-content {
    max-width: 80%;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.message.user .message-content {
    align-items: flex-end;
}

.message-bubble {
    padding: 12px 16px;
    border-radius: 18px;
    line-height: 1.4;
    white-space: pre-line;
    word-wrap: break-word;
}

.user-bubble {
    background: #4f46e5;
    color: white;
    border-bottom-right-radius: 6px;
}

.bot-bubble {
    background: #f3f4f6;
    color: #374151;
    border-bottom-left-radius: 6px;
}

.error-bubble {
    background: #fee2e2;
    color: #dc2626;
    border: 1px solid #fca5a5;
}

.dark .bot-bubble {
    background: #374151;
    color: #f3f4f6;
}

.dark .error-bubble {
    background: #7f1d1d;
    color: #fca5a5;
    border-color: #991b1b;
}

.message-time {
    font-size: 11px;
    color: #9ca3af;
}

.typing-indicator {
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 12px 20px;
}

.typing-indicator span {
    width: 6px;
    height: 6px;
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
        transform: translateY(-4px);
    }
}

.chat-input {
    padding: 16px;
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
    transition: all 0.3s ease;
}

.chat-slide-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
}

.chat-slide-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
}

/* Scrollbar personnalisée */
.chat-messages::-webkit-scrollbar {
    width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.dark .chat-messages::-webkit-scrollbar-track {
    background: #374151;
}

.chat-messages::-webkit-scrollbar-thumb {
    background: #c5c5c5;
    border-radius: 3px;
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
@media (max-width: 640px) {
    .ai-chat-window {
        width: calc(100vw - 40px);
        right: 20px;
        left: 20px;
    }

    .ai-chat-button {
        bottom: 20px;
        right: 20px;
    }

    .ai-chat-window {
        bottom: 90px;
        right: 20px;
        left: 20px;
    }
}
</style>