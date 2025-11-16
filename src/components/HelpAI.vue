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
                            <p class="text-xs text-gray-500 dark:text-gray-400">En ligne <span class="text-green-500">•</span></p>
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
                </div>

                <!-- Zone de saisie -->
                <div class="chat-input">
                    <div class="relative">
                        <input v-model="userInput" @keypress.enter="sendMessage" type="text"
                            placeholder="Posez votre question..."
                            class="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                            :disabled="isTyping" />
                        <button @click="sendMessage" :disabled="!userInput.trim() || isTyping"
                            class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary hover:text-primary/80 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors">
                            <Icon icon="heroicons:paper-airplane-20-solid" class="text-xl" />
                        </button>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        Assistant IA • Réponses en temps réel
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
        toggleChat() {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
            }
        },
        sendMessage() {
            if (!this.userInput.trim() || this.isTyping) return;

            const userMessage = {
                type: "user",
                text: this.userInput,
                time: this.getCurrentTime()
            };

            this.messages.push(userMessage);
            const userQuestion = this.userInput;
            this.userInput = "";

            this.scrollToBottom();

            // Simulation de réponse IA
            this.isTyping = true;
            setTimeout(() => {
                this.generateResponse(userQuestion);
                this.isTyping = false;
                this.scrollToBottom();
            }, 1000 + Math.random() * 1000);
        },
        generateResponse(question) {
            const responses = {
                "congé": "Pour gérer les congés, vous pouvez :\n• Consulter le calendrier des congés\n• Soumettre une nouvelle demande\n• Voir le solde de vos congés\n• Suivre l'état de vos demandes",
                "employé": "La gestion des employés inclut :\n• Consultation de la liste des employés\n• Ajout de nouveaux employés\n• Modification des informations\n• Gestion des contrats",
                "poste": "Pour la gestion des postes :\n• Consulter les postes disponibles\n• Créer de nouveaux postes\n• Voir l'organigramme\n• Définir les compétences requises",
                "dashboard": "Le tableau de bord vous montre :\n• Statistiques des employés\n• Congés en cours\n• Alertes importantes\n• Activités récentes",
                "aide": "Je peux vous aider avec :\n• Gestion des congés\n• Informations employés\n• Processus RH\n• Utilisation du système\nPosez-moi une question spécifique !",
                "bonjour": "Bonjour ! Comment puis-je vous aider avec votre ERP RH aujourd'hui ?",
                "merci": "De rien ! N'hésitez pas si vous avez d'autres questions. 😊"
            };

            const questionLower = question.toLowerCase();
            let response = "Je comprends que vous avez besoin d'aide. Pouvez-vous préciser votre question ? Je peux vous aider avec la gestion des congés, des employés, des postes, ou d'autres aspects de l'ERP RH.";

            for (const [key, value] of Object.entries(responses)) {
                if (questionLower.includes(key)) {
                    response = value;
                    break;
                }
            }

            this.messages.push({
                type: "bot",
                text: response,
                time: this.getCurrentTime()
            });
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

.dark .bot-bubble {
    background: #374151;
    color: #f3f4f6;
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