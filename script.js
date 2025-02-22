document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.querySelector("input[name='password']");
    const resultContainer = document.createElement("div");
    resultContainer.classList.add("result");
    document.querySelector(".container").appendChild(resultContainer);

    passwordInput.addEventListener("input", function () {
        const password = passwordInput.value;
        const { score, strength, crackTime } = analyzePassword(password);

        resultContainer.innerHTML = `
            <p><strong>Strength:</strong> ${strength}</p>
            <p><strong>Estimated Time to Crack:</strong> ${crackTime}</p>
        `;
    });

    function analyzePassword(password) {
        let score = 0;
        let charsetSize = 0;

        if (password.match(/[a-z]/)) charsetSize += 26;
        if (password.match(/[A-Z]/)) charsetSize += 26;
        if (password.match(/[0-9]/)) charsetSize += 10;
        if (password.match(/[^a-zA-Z0-9]/)) charsetSize += 32;

        const entropy = password.length * Math.log2(charsetSize);
        let crackTime = estimateCrackTime(entropy);

        let strength = "Weak";
        if (entropy > 40) strength = "Moderate";
        if (entropy > 60) strength = "Strong";
        if (entropy > 80) strength = "Very Strong";

        return { score, strength, crackTime };
    }

    function estimateCrackTime(entropy) {
        const guessesPerSecond = 1e9; // ~1 billion guesses/sec (modern brute force rate)
        const secondsToCrack = Math.pow(2, entropy) / guessesPerSecond;

        if (secondsToCrack < 60) return "Less than a minute";
        if (secondsToCrack < 3600) return `${Math.round(secondsToCrack / 60)} minutes`;
        if (secondsToCrack < 86400) return `${Math.round(secondsToCrack / 3600)} hours`;
        if (secondsToCrack < 31557600) return `${Math.round(secondsToCrack / 86400)} days`;
        if (secondsToCrack < 3155760000) return `${Math.round(secondsToCrack / 31557600)} years`;
        return `Millions of years`;
    }
});
