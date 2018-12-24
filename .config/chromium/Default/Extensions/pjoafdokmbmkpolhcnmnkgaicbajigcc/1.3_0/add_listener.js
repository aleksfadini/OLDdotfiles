(function ()
{
	var shortcut = {
		ctrlKey: "true",
		shiftKey: "true",
		altKey: "false",
		key:"c"
	};
	
	document.addEventListener("keyup", function (event)
	{
		if ((event.ctrlKey == (shortcut.ctrlKey == "true"))
		&& (event.shiftKey == (shortcut.shiftKey == "true"))
		&& (event.altKey == (shortcut.altKey == "true"))
		&& (String.fromCharCode(event.keyCode).toLowerCase() == shortcut.key.toLowerCase()))
		{
			chrome.runtime.sendMessage({action:"devonthink_activate"});
			event.stopPropagation();
			event.preventDefault();
		}
	}, false);

	var isInstalledNode = document.createElement('div');
	isInstalledNode.id = 'cliptodevonthink-is-installed';
	document.body.appendChild(isInstalledNode);
})();
