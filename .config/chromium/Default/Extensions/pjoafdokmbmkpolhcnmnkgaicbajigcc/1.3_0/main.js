var activate = function()
{
	chrome.tabs.executeScript(null, {file:"activate.js"});
}

chrome.browserAction.onClicked.addListener(function (tab) { activate(); });
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse)
{
	if (request.action == "devonthink_activate")
	{
		activate();
	}
});