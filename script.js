document.getElementById("config-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const gameId = document.getElementById("game-id").value.trim();
    const apiKey = document.getElementById("api-key").value;
    const backgroundColor = document.getElementById("background-color").value;

    // Mudar a cor de fundo da página
    document.body.style.backgroundColor = backgroundColor;

    // Verifica se o campo gameId está vazio
    if (gameId === "") {
        // Se estiver vazio, busca o último jogo jogado pelo usuário
        fetchLastPlayedGame(username, apiKey);
    } else {
        // Caso contrário, busca as conquistas do jogo informado
        fetchAchievements(username, gameId, apiKey);
    }
});

// Novo listener para o botão "Conquista da Semana"
document.getElementById("achievement-week").addEventListener("click", function () {
    const apiKey = document.getElementById("api-key").value; // Pega a chave da API do input
    fetchAchievementOfTheWeek(apiKey); // Chama a função para buscar a conquista da semana
});

function fetchLastPlayedGame(username, apiKey) {
    const url = `https://retroachievements.org/API/API_GetUserSummary.php?z=${username}&y=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na resposta: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.RecentlyPlayed && data.RecentlyPlayed.length > 0) {
                const lastGameId = data.RecentlyPlayed[0].GameID;
                fetchAchievements(username, lastGameId, apiKey);
            } else {
                document.getElementById("achievements").innerHTML = "<p>Nenhum jogo jogado recentemente encontrado.</p>";
            }
        })
        .catch(error => {
            console.error("Erro ao buscar o último jogo jogado:", error);
            document.getElementById("achievements").innerHTML = "<p>Erro ao buscar o último jogo jogado. Verifique os dados fornecidos.</p>";
        });
}

function fetchAchievements(username, gameId, apiKey) {
    const url = `https://retroachievements.org/API/API_GetGameInfoAndUserProgress.php?z=${username}&y=${apiKey}&g=${gameId}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na resposta: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.Achievements && data.Achievements.length > 0) {
                displayAchievements(data.Achievements);
            } else {
                document.getElementById("achievements").innerHTML = "<p>Não foram encontradas conquistas para este jogo.</p>";
            }
        })
        .catch(error => {
            console.error("Erro ao buscar conquistas:", error);
            document.getElementById("achievements").innerHTML = "<p>Erro ao buscar conquistas. Verifique se o ID do jogo e a API Key estão corretos.</p>";
        });
}

function fetchAchievementOfTheWeek(apiKey) {
    const url = `https://retroachievements.org/API/API_GetAchievementOfTheWeek.php?y=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na resposta: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            displayAchievementOfTheWeek(data);
        })
        .catch(error => {
            console.error("Erro ao buscar a conquista da semana:", error);
            document.getElementById("achievements").innerHTML = "<p>Erro ao buscar a conquista da semana. Verifique a chave da API.</p>";
        });
}

function displayAchievementOfTheWeek(data) {
    const achievementsContainer = document.getElementById("achievements");
    achievementsContainer.innerHTML = ""; // Limpa os resultados anteriores

    if (data && data.Achievement) {
        const achievement = data.Achievement;

        const achievementDiv = document.createElement("div");
        achievementDiv.classList.add("achievement");

        achievementDiv.innerHTML = `
            <h3>${achievement.Title}</h3>
            <p>${achievement.Description}</p>
            <p>Pontos: ${achievement.Points}</p>
            <img src="https://retroachievements.org/${achievement.BadgeName}" alt="${achievement.Title}">
        `;

        achievementsContainer.appendChild(achievementDiv);
    } else {
        achievementsContainer.innerHTML = "<p>Não foram encontradas conquistas da semana.</p>";
    }
}

function displayAchievements(achievements) {
    const achievementsContainer = document.getElementById("achievements");
    achievementsContainer.innerHTML = ""; // Limpa os resultados anteriores

    achievements.forEach(achievement => {
        const achievementDiv = document.createElement("div");
        achievementDiv.classList.add("achievement");

        achievementDiv.innerHTML = `
            <h3>${achievement.Title}</h3>
            <p>${achievement.Description}</p>
            <p>Pontos: ${achievement.Points}</p>
            <img src="https://retroachievements.org/${achievement.BadgeName}" alt="${achievement.Title}">
        `;

        achievementsContainer.appendChild(achievementDiv);
    });
}
