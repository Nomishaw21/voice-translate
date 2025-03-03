const apiUrl = "https://api.mymemory.translated.net/get";

// Check if SpeechRecognition is supported
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!window.SpeechRecognition) {
    alert("Speech recognition is not supported in this browser. Try using Chrome or Edge.");
} else {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // Set to "auto" if needed
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let isListening = false;

    document.getElementById("start-btn").addEventListener("click", () => {
        if (!isListening) {
            recognition.start();
            isListening = true;
            console.log("Listening...");
        } else {
            recognition.stop();
            isListening = false;
            console.log("Stopped listening.");
        }
    });

    recognition.onresult = async (event) => {
        const spokenText = event.results[0][0].transcript;
        document.getElementById("recognized-text").innerText = spokenText;

        console.log("Recognized Text:", spokenText);

        const translatedText = await translateText(spokenText, "en");
        document.getElementById("translated-text").innerText = translatedText;

        console.log("Translated Text:", translatedText);
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        alert(`Error: ${event.error}. Check microphone permissions.`);
    };

    recognition.onend = () => {
        isListening = false;
        console.log("Speech recognition stopped.");
    };
}

// Function to translate text using MyMemory API
async function translateText(text, targetLang) {
    try {
        const response = await fetch(`${apiUrl}?q=${encodeURIComponent(text)}&langpair=auto|${targetLang}`);
        const data = await response.json();
        return data.responseData.translatedText;
    } catch (error) {
        console.error("Translation API Error:", error);
        return "Translation error!";
    }
}
