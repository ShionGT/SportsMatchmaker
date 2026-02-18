let currentUser = null;

// JSONファイルからデータを非同期に取得する関数
async function fetchData(filepath) {
  try {
    const response = await fetch(filepath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}


// ページが読み込まれたときにユーザーデータを表示する
document.addEventListener("DOMContentLoaded", () => {
  currentUser = localStorage.getItem("user_id");

  if (!currentUser) {
      window.location.href = "/page/login.html";
    return;
  }

  // Logged in
  currentUser = user_id;
});

// -- login.htmlでユーザーがログインしたときにユーザーIDを保存するコード ---

// ログインフォームの送信イベントを処理する
document.getElementById("login_form").addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // ユーザーデータを取得して認証する
  fetchData("/json/userdata.json").then((data) => {
    if (data) {
    //   const user = data.find((u) => u.username === username && u.password === password);
    const user = data.find((u) => u.username === username);
      if (user) {
        localStorage.setItem("user_id", user.id);
        window.location.href = "/index.html";
      } else {
        alert("ユーザー名が間違っています");
      }
    }
  });
});

const userData = await fetchData("/json/userdata.json").then((data) => {
  if (data) {
    console.log("User data loaded:", data);
    user = data.find((u) => u.id === parseInt(currentUser));
    if (user) {
      console.log("Current user data:", user);
      return user;
    } else {
      console.warn("Failed to find user data for current user");
      return null;
    }
  }
});

const teamData = await fetchData("/json/teamdata.json").then((data) => {
  if (data) {
    console.log("Team data loaded:", data);
    team = data.find((t) => t.id === user.team_id);
    if (team) {
      console.log("Current user's team data:", team);
      return team;
    } else {
      console.warn("Failed to find team data for current user");
      return null;
    }
  }
});

const userMatchesData = await fetchData("/json/matchdata.json").then((data) => {
  if (data) {
    console.log("Match data loaded:", data);
    const matches = data.filter((m) => m.team1_id === team.id || m.team2_id === team.id);
    console.log("Current user's matches:", matches);
    return matches;
}

// --- mypage.htmlのユーザーデータ表示と編集機能の実装 ---

// ユーザーデータを取得して表示する関数
function fetchUserData() {
  fetch("/json/userdata.json")
    .then((response) => response.json())
    .then((data) => {
      const user = data[currentUser]; // 仮に最初のユーザーデータを使用
      document.getElementById("name").textContent = user.name;
      document.getElementById("username").textContent = user.username;
      document.getElementById("email").textContent = user.email;
      // チーム名は仮に固定値を表示
      document.getElementById("team_name").textContent = "サンプルチーム";
    })
    .catch((error) => console.error("Error fetching user data:", error));
}
