const apiUrl = "https://api.mymemory.translated.net/get";

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!window.SpeechRecognition) {
    alert("Speech recognition is not supported in this browser. Try using Chrome or Edge.");
} else {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    document.getElementById("start-btn").addEventListener("click", () => {
        recognition.start();
        console.log("Listening...");
    });

    recognition.onresult = async (event) => {
        const spokenText = event.results[0][0].transcript;
        document.getElementById("recognized-text").innerText = spokenText;

        console.log("Recognized:", spokenText);

        const translatedText = await translateText(spokenText, "en");
        document.getElementById("translated-text").innerText = translatedText;

        console.log("Translated:", translatedText);
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        alert(`Error: ${event.error}`);
    };
}

async function translateText(text, targetLang) {
    try {
        const response = await fetch(`${apiUrl}?q=${encodeURIComponent(text)}&langpair=auto|${targetLang}`);
        const data = await response.json();
        return data.responseData.translatedText;
    } catch (error) {
        console.error("Translation API Error:", error);
        return "Translation failed!";
    }
}
