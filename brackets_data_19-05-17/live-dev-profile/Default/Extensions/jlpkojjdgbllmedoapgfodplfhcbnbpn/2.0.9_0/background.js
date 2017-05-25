"use strict";var PageRuler={init:function(type,previousVersion){console.log("init");var manifest=chrome.runtime.getManifest(),version=manifest.version;switch(type){case"install":console.log("First time install version: ",version),PageRuler.Analytics.trackEvent("Run","Install",version),chrome.storage.sync.set({statistics:!0,hide_update_tab:!1});break;case"update":console.log("Update version. From: ",previousVersion," To: ",version),PageRuler.Analytics.trackEvent("Run","Update",version);break;default:console.log("Existing version run: ",version),PageRuler.Analytics.trackEvent("Run","Open",version)}},image:function(file){return{19:"images/19/"+file,38:"images/38/"+file}},load:function(tabId){console.log("loading content script"),chrome.tabs.executeScript(tabId,{file:"content.js"},function(){console.log("content script for tab #"+tabId+" has loaded"),PageRuler.enable(tabId)})},enable:function(tabId){chrome.tabs.sendMessage(tabId,{type:"enable"},function(){console.log("enable message for tab #"+tabId+" was sent"),PageRuler.Analytics.trackEvent("Action","Enable"),chrome.browserAction.setIcon({path:PageRuler.image("browser_action_on.png"),tabId:tabId})})},disable:function(tabId){chrome.tabs.sendMessage(tabId,{type:"disable"},function(){console.log("disable message for tab #"+tabId+" was sent"),PageRuler.Analytics.trackEvent("Action","Disable"),chrome.browserAction.setIcon({path:PageRuler.image("browser_action.png"),tabId:tabId})})},browserAction:function(tab){var tabId=tab.id,args="'action': 'loadtest','loaded': window.hasOwnProperty('__PageRuler'),'active': window.hasOwnProperty('__PageRuler') && window.__PageRuler.active";chrome.tabs.executeScript(tabId,{code:"chrome.runtime.sendMessage({ "+args+" });"})},openUpdateTab:function(type){chrome.storage.sync.get("hide_update_tab",function(items){items.hide_update_tab||chrome.tabs.create({url:"update.html#"+type})})},setPopup:function(tabId,changeInfo,tab){var url=changeInfo.url||tab.url||!1;url&&((/^chrome\-extension:\/\//.test(url)||/^chrome:\/\//.test(url))&&chrome.browserAction.setPopup({tabId:tabId,popup:"popup.html#local"}),/^https:\/\/chrome\.google\.com\/webstore\//.test(url)&&chrome.browserAction.setPopup({tabId:tabId,popup:"popup.html#webstore"}))}};chrome.browserAction.onClicked.addListener(PageRuler.browserAction),chrome.tabs.onUpdated.addListener(PageRuler.setPopup),chrome.runtime.onStartup.addListener(function(){console.log("onStartup"),PageRuler.init()}),chrome.runtime.onInstalled.addListener(function(details){switch(console.log("onInstalled"),PageRuler.init(details.reason,details.previousVersion),details.reason){case"install":PageRuler.openUpdateTab("install");break;case"update":PageRuler.openUpdateTab("update")}}),chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){var tabId=sender.tab&&sender.tab.id;switch(console.group("message received from tab #"+tabId),console.log("message: ",message),console.log("sender: ",sender),message.action){case"loadtest":message.loaded?message.active?PageRuler.disable(tabId):PageRuler.enable(tabId):PageRuler.load(tabId);break;case"disable":console.log("tear down"),tabId&&PageRuler.disable(tabId);break;case"setColor":console.log("saving color "+message.color),PageRuler.Analytics.trackEvent("Settings","Color",message.color),chrome.storage.sync.set({color:message.color});break;case"getColor":console.log("requesting color"),chrome.storage.sync.get("color",function(items){var color=items.color||"#0080ff";console.log("color requested: "+color),sendResponse(color)});break;case"setDockPosition":console.log("saving dock position "+message.position),PageRuler.Analytics.trackEvent("Settings","Dock",message.position),chrome.storage.sync.set({dock:message.position});break;case"getDockPosition":console.log("requesting dock position"),chrome.storage.sync.get("dock",function(items){var position=items.dock||"top";console.log("dock position requested: "+position),sendResponse(position)});break;case"setGuides":console.log("saving guides visiblity "+message.visible),PageRuler.Analytics.trackEvent("Settings","Guides",message.visible&&"On"||"Off"),chrome.storage.sync.set({guides:message.visible});break;case"getGuides":console.log("requesting guides visibility"),chrome.storage.sync.get("guides",function(items){var visiblity=items.hasOwnProperty("guides")?items.guides:!0;console.log("guides visibility requested: "+visiblity),sendResponse(visiblity)});break;case"trackEvent":console.log("track event message received: ",message.args),PageRuler.Analytics.trackEvent.apply(PageRuler.Analytics,message.args),sendResponse();break;case"trackPageview":console.log("track pageview message received: ",message.page),PageRuler.Analytics.trackPageview(message.page),sendResponse();break;case"openHelp":PageRuler.Analytics.trackEvent(["Action","Help Link"]),chrome.tabs.create({url:chrome.extension.getURL("update.html")+"#help"})}return console.groupEnd(),!0}),chrome.commands.onCommand.addListener(function(command){console.log("Command:",command)});var _gaq=_gaq||[];_gaq.push(["_setAccount","UA-44581945-2"]),function(){var ga=document.createElement("script");ga.type="text/javascript",ga.async=!0,ga.src="https://ssl.google-analytics.com/ga.js";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(ga,s)}(),function(pr){pr.Analytics={checkEnabled:function(callback){chrome.storage.sync.get("statistics",function(items){var enabled=!!items.statistics;enabled?callback():console.log("statistics disabled")})},trackPageview:function(page){console.log("Analytics.trackPageview: ",page),this.checkEnabled(function(){var args=["_trackPageview",page];_gaq.push(args),console.log("trackPageview sent: ",args)})},trackEvent:function(category,action,label,value){console.log("Analytics.trackEvent: ",arguments),this.checkEnabled(function(){var args=["_trackEvent",category,action];label&&(args.push(label),value&&args.push(value)),_gaq.push(args),console.log("trackEvent sent: ",args)})}}}(PageRuler);