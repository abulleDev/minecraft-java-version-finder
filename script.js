async function getJavaVersion(version) {
  const mainResponse = await fetch(
    'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json'
  );
  const mainData = await mainResponse.json();
  const url = mainData.versions.find(({ id }) => id === version)?.url;

  if (url === undefined) {
    throw new Error(`입력하신 ${version} 버전은 존재하지 않는 버전입니다.`);
  }

  const versionResponse = await fetch(url);
  const {
    javaVersion: { majorVersion: javaVersion },
  } = await versionResponse.json();
  return javaVersion;
}

document
  .getElementsByClassName('card-input')[0]
  .addEventListener('submit', async (event) => {
    event.preventDefault();

    const gameVersion = document.getElementById('game-version').value;

    try {
      if (gameVersion.trim() === '') {
        document.getElementById(
          'result'
        ).innerHTML = `<div class="error-message"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg><span>게임 버전을 입력해주세요.</span></div>`;
        return;
      }

      const javaVersion = `Java ${await getJavaVersion(gameVersion)}`;
      document.getElementById(
        'result'
      ).innerHTML = `<div class="result-message"><span>필요한 Java 버전</span><p>${javaVersion}</p></div>`;
    } catch (error) {
      document.getElementById(
        'result'
      ).innerHTML = `<div class="error-message"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg><span>${error.message}</span></div>`;
    } finally {
      const { width, height } = document
        .getElementsByClassName('card-container')[0]
        .getBoundingClientRect();
      window.parent.postMessage({ type: 'setIframeSize', width, height }, '*');
    }
  });

const { width, height } = document
  .getElementsByClassName('card-container')[0]
  .getBoundingClientRect();
window.parent.postMessage({ type: 'setIframeSize', width, height }, '*');
