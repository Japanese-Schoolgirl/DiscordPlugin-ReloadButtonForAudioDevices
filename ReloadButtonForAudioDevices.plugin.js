	//META{"name":"ReloadButtonForAudioDevices"}*//

class ReloadButtonForAudioDevices {
	getName() { return 'Reload Button for Output and Input devices'; }
	getDescription() { return 'A ~very~ lazily written spaghetti plugin that adds reload button for output and input devices for Discord. >Currently requires EN or RU Discord language<'; }
	getVersion() { return '0.0.1'; }
	getAuthor() { return 'Japanese Schoolgirl (Lisa)'; }
	initConstructor ()
	{
		this.waitTime = 10000;
	}
	load() {}
	unload() {}

	getNameAsID() { return this.getName().replace(/\s/g, '_'); }
	start()
	{
		const PluginName = this.getName();
		const PluginNameAsID = this.getNameAsID();
		// Editable variables //
		const clicksDelay = 400;
		const attemptsLimit = 5;
		////////////////////////
		function GetLanguage()
		{
			let errorMsg = `Plugin ${PluginName} doesn't support your current Discord language. Currently this spaghetti code works only with English and Russian languages :(`;
			let returnLang = navigator.language == "ru" ? "ru" : navigator.language == "en-US" ? "en-US" : null;
			if(!returnLang) { console.error(errorMsg); window.alert(errorMsg); }
			return returnLang
		}
		function SyncTimeout(func, ms)
		{
			return new Promise(resolve => setTimeout(() => { resolve(); func(); }, ms));
		}
		async function ReloadDiscordAudio()
		{
			async function ClickOrWait(queryParam, attempt = 1)
			{
				if(attempt >= attemptsLimit) { return };
				if(!document.querySelector(queryParam)) { return await SyncTimeout(()=> { ClickOrWait(queryParam, attempt+1) }, clicksDelay) }
				document.querySelector(queryParam).click();
			}
			async function DevicesClick(Device_Label, attempt = 1)
			{
				if(!Device_Label) { return console.error("Where is my parameter?"); }
				if(attempt >= attemptsLimit) { return }

				try
				{
					let DeviceSetting = [...document.querySelectorAll('h5')].filter(el => el.innerText === Device_Label)[0].parentElement.querySelector('span[class*="deviceOptionLabel-"]');
					DeviceSetting.click();

					let ConfirmDevice = document.querySelector('svg[class*="selectedIcon-"]').parentElement.querySelector('span[class*="deviceOptionLabel-"]');
					ConfirmDevice.click();
				} catch(err) { return await SyncTimeout(()=> { DevicesClick(Device_Label, attempt+1) }, clicksDelay); }
			}
			let Label_UserSettings = DiscordLang == "ru" ? "Настройки пользователя" : "User Settings";
			let Label_InputDevice = DiscordLang == "ru" ? "УСТРОЙСТВО ВВОДА" : "INPUT DEVICE";
			let Label_OutputDevice = DiscordLang == "ru" ? "УСТРОЙСТВО ВЫВОДА": "OUTPUT DEVICE";
			let Label_Close = DiscordLang == "ru" ? "Закрыть" : "Close";

			let UserSettings = `button[aria-label*="${Label_UserSettings}"]`;
			await ClickOrWait(UserSettings);

			let VoicePanelOption = 'div[aria-controls*="voice-&-video-tab"]';
			await ClickOrWait(VoicePanelOption);

			await DevicesClick(Label_InputDevice);
			await DevicesClick(Label_OutputDevice);

			let CloseSettingsButton = `div[class*="closeButton-"][aria-label="${Label_Close}"][role="button"]`;
			await ClickOrWait(CloseSettingsButton);
		}
		function AddAudioReloadButton(DiscordUserPanel)
		{
			if(!document.getElementById(PluginNameAsID))
			{
				let PluginButtonStyle = `color: var(--interactive-active); background-color: var(--background-tertiary); font-size: 14px; width: 100%; padding: 5px;`;
				let PluginButtonCode = `<button id="${PluginNameAsID}" style="${PluginButtonStyle}">${PluginButtonText}</button>`;
				DiscordUserPanel.children[1].insertAdjacentHTML('beforebegin', PluginButtonCode);
				document.getElementById(PluginNameAsID).addEventListener('click', ReloadDiscordAudio);
			}
		}
		const DiscordLang = GetLanguage();
		const PluginButtonText = DiscordLang == "ru" ? "Перезагрузить аудио девайсы" : "Reload audio devices";
		const Label_UserPanel = DiscordLang == "ru" ? "Пользовательская область" : "User area";

		// Launch
		this.ReloadPluginObserver = new MutationObserver((mutations) =>
		{
			if(document.getElementById(PluginNameAsID)) { return }
			let DiscordUserPanel = document.querySelector(`section[aria-label*="${Label_UserPanel}"]`);
			mutations.forEach((el) =>
			{
				if(!DiscordUserPanel) { return }
				else { AddAudioReloadButton(DiscordUserPanel); }
			});
		})
		if(DiscordLang) { this.ReloadPluginObserver.observe(document.body, { subtree: true, childList: true }); }
	}

	stop()
	{
		const PluginNameAsID = this.getNameAsID();
		this.ReloadPluginObserver.disconnect();
		if(document.getElementById(PluginNameAsID)) { document.getElementById(PluginNameAsID).remove(); }
	}

}

