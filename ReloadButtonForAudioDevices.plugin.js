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
		function GetLanguage()
		{
			if(document.querySelector('[aria-label*="Пользовательская область"]')) { return 'ru'; }
			if(document.querySelector('[aria-label*="User area"]')) { return 'en'; }
			else { return console.error(`Plugin ${PluginName} doesn't support your current Discord language. Currently this spaghetti code works only with English and Russian languages :(`); }
		}
		function ReloadDiscordAudio()
		{
			let Label_UserSettings = DiscordLang == "ru" ? "Настройки пользователя" : "User Settings";
			let Label_InputDevice =  DiscordLang == "ru" ? "УСТРОЙСТВО ВВОДА" : "INPUT DEVICE";
			let Label_OutputDevice = DiscordLang == "ru" ? "УСТРОЙСТВО ВЫВОДА": "OUTPUT DEVICE";
			let Label_Close = DiscordLang == "ru" ? "Закрыть" : "Close";

			let UserSettings = document.querySelector(`button[aria-label*="${Label_UserSettings}"]`);
			UserSettings.click();

			let VoicePanelOption = document.querySelector('div[aria-controls*="voice-&-video-tab"]');
			VoicePanelOption.click();

			function DevicesClick(Device_Label)
			{
				if(!Device_Label) { return console.error("Where is my parameter?"); }

				let DeviceSetting = [...document.querySelectorAll('h5')].filter(el => el.innerText === Device_Label)[0].parentElement.querySelector('span[class*="deviceOptionLabel-"]');
				DeviceSetting.click();

				let ConfirmDevice = document.querySelector('svg[class*="selectedIcon-"]').parentElement.querySelector('span[class*="deviceOptionLabel-"]');
				ConfirmDevice.click();
			}
			function CloseSettings()
			{
				let CloseSettingsButton = document.querySelector(`div[class*="closeButton-"][aria-label="${Label_Close}"][role="button"]`);
				CloseSettingsButton.click();
			}
			setTimeout(()=>
			{
				DevicesClick(Label_InputDevice);
				setTimeout(()=>
				{
					DevicesClick(Label_OutputDevice);
					CloseSettings();
				}, 800);
			}, 800);
		}
		function AddAudioReloadButton()
		{
			let PluginButtonText = DiscordLang == "ru" ? "Перезагрузить аудио девайсы" : "Reload audio devices";
			let Label_UserPanel = DiscordLang == "ru" ? "Пользовательская область" : "User area";
			//let Label_FAQ = 'Помощь'; let Label_LinkFAQ = 'https://support.discord.com'; let DiscordHelpButton = document.querySelector(`a[href*="${Label_LinkFAQ}"] div[aria-label*="${Label_FAQ}"]`);

			let DiscordUserPanel = document.querySelector(`section[aria-label*="${Label_UserPanel}"]`);
			if(!document.getElementById(PluginNameAsID))
			{
				let PluginButtonStyle = `color: var(--interactive-active); background-color: var(--background-tertiary); font-size: 14px; width: 100%; padding: 5px;`;
				let PluginButtonCode = `<button id="${PluginNameAsID}" style="${PluginButtonStyle}">${PluginButtonText}</button>`;
				DiscordUserPanel.children[1].insertAdjacentHTML('beforebegin', PluginButtonCode);
				document.getElementById(PluginNameAsID).addEventListener('click', ReloadDiscordAudio);
			}
			console.log(`Plugin ${PluginName} loading complete`);
		}
		const DiscordLang = GetLanguage();
		if(DiscordLang) { console.log(`Plugin ${PluginName} loading...`); setTimeout(AddAudioReloadButton, 10000); } // What a shame way to make it
	}

	stop()
	{
		const PluginNameAsID = this.getNameAsID();
		if(document.getElementById(PluginNameAsID)) { document.getElementById(PluginNameAsID).remove(); }
	}

}

