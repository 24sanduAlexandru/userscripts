// ==UserScript==
//
// @name            MakeFolders
// @namespace       Violentmonkey Scripts
//
// @match           https://neal.fun/infinite-craft/*
//
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM.xmlHttpRequest
// @grant           unsafeWindow
//
// @run-at          document-end
//
// @require         https://unpkg.com/wanakana
// @require         https://raw.githubusercontent.com/surferseo/intl-segmenter-polyfill/master/dist/bundled.js
//
// @version         3.0
// @author          Alexander_Andercou, Mikarific
// @description     Adds folders to Infinite Craft
//
// @downloadURL     https://raw.githubusercontent.com/InfiniteCraftCommunity/userscripts/master/userscripts/24sandualexandru/MakeFolders/index.user.js
// @updateURL       https://raw.githubusercontent.com/InfiniteCraftCommunity/userscripts/master/userscripts/24sandualexandru/MakeFolders/index.user.js
//
// @license         MIT
//
// ==/UserScript==

(function () {
	let folders = ["alphabets", "diverse"];
  let foldersSize=200;
  let folderSizes={"alphabets":200,"diverse":100};
	let currentFolder = null;
	let mode = 0;
	let folderDiv = null;
	let previousmode = null;
	const NoneMode = 0;
	let hidden = 1;
	let dropMenu = null;
	let ThemeButton = null;
	let selectedPrompt = null;
	let foldersData = {};
	let ParentSource = null;
	let openFolder = true;
  var openedFolders=0;

	function existsFolder(fileName) {
		for (let f of document.querySelectorAll(".folder")) {
			if (f.children[0].children[0].textContent == fileName) return true;
		}
		return false;
	}

	function confirmPrompt(doStuff, extraPrompt = "") {
		let parent = document.querySelector(".container");

		let dialog = document.createElement("dialog");
		let label = document.createElement("label");

		let saveButton = document.createElement("button");
		let closeButton = document.createElement("button");
		label.textContent = "Confirm or cancel " + extraPrompt;
		closeButton.textContent = "Close without saving";
		saveButton.textContent = "Confirm";

		saveButton.style.float = "right";
		closeButton.style.float = "left";
		saveButton.addEventListener("click", function () {
			doStuff();
			dialog.close();
		});

		closeButton.addEventListener("click", function () {
			dialog.close();
		});
		dialog.appendChild(label);
		dialog.appendChild(document.createElement("br"));
		dialog.appendChild(document.createElement("br"));

		dialog.appendChild(saveButton);
		dialog.appendChild(closeButton);

		dialog.style.position = "absolute";
		dialog.style.top = "33%";
		dialog.style.left = "25%";
		dialog.style.background = window.getComputedStyle(document.querySelector(".container")).getPropertyValue("--background-color").trim();
		dialog.style.color = window.getComputedStyle(document.querySelector(".container")).getPropertyValue("--text-color").trim();

		parent.appendChild(dialog);
		dialog.showModal();
	}

	function initTheAlphabeth() {
		let alphabetData = {
			a: [
				{
					emoji: "🅰️",
					text: '"a"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(0, 127, 255) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 46; height: 43px; width: 80px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(0, 127, 255); border-width: 2px; --shadow-rgb: rgb(0,127,255);",
				},
				{
					emoji: "🅱️",
					text: '"b"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(139, 69, 19) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 54; height: 43px; width: 81px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(139, 69, 19); border-width: 2px; --shadow-rgb: rgb(139,69,19);",
				},
				{
					emoji: "🇨",
					text: '"c"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(220, 20, 60) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 62; height: 43px; width: 61px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(220, 20, 60); border-width: 2px; --shadow-rgb: rgb(220,20,60);",
				},
				{
					emoji: "🇩",
					text: '"d"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(240, 225, 48) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 66; height: 43px; width: 64px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(240, 225, 48); border-width: 2px; --shadow-rgb: rgb(240,225,48);",
				},
				{
					emoji: "🇪",
					text: '"e"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(80, 200, 120) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 74; height: 43px; width: 60px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(80, 200, 120); border-width: 2px; --shadow-rgb: rgb(80,200,120);",
				},
				{
					emoji: "🇫",
					text: '"f"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(217, 2, 125) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 78; height: 43px; width: 57px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(217, 2, 125); border-width: 2px; --shadow-rgb: rgb(217,2,125);",
				},
				{
					emoji: "🇬",
					text: '"g"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(128, 128, 128) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 82; height: 43px; width: 63px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(128, 128, 128); border-width: 2px; --shadow-rgb: rgb(128,128,128);",
				},
				{
					emoji: "🤔",
					text: '"h"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(223, 115, 255) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 90; height: 43px; width: 81px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(223, 115, 255); border-width: 2px; --shadow-rgb: rgb(223,115,255);",
				},
				{
					emoji: "👁️",
					text: '"i"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(75, 0, 130) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 95; height: 43px; width: 75px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(75, 0, 130); border-width: 2px; --shadow-rgb: rgb(75,0,130);",
				},
				{
					emoji: "🇯",
					text: '"j"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(0, 168, 107) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 99; height: 43px; width: 53px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(0, 168, 107); border-width: 2px; --shadow-rgb: rgb(0,168,107);",
				},
				{
					emoji: "👍",
					text: '"k"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(195, 176, 145) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 103; height: 43px; width: 78px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(195, 176, 145); border-width: 2px; --shadow-rgb: rgb(195,176,145);",
				},
				{
					emoji: "👍",
					text: '"l"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(220, 208, 255) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 107; height: 43px; width: 73px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(220, 208, 255); border-width: 2px; --shadow-rgb: rgb(220,208,255);",
				},
				{
					emoji: "🆖",
					text: '"n"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(0, 0, 128) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 111; height: 43px; width: 80px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(0, 0, 128); border-width: 2px; --shadow-rgb: rgb(0,0,128);",
				},
				{
					emoji: "🇲",
					text: '"m"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(255, 0, 144) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 112; height: 43px; width: 72px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(255, 0, 144); border-width: 2px; --shadow-rgb: rgb(255,0,144);",
				},
				{
					emoji: "👌",
					text: '"o"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(255, 165, 0) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 116; height: 43px; width: 73px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(255, 165, 0); border-width: 2px; --shadow-rgb: rgb(255,165,0);",
				},
				{
					emoji: "🅿️",
					text: '"p"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(160, 32, 240) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 120; height: 43px; width: 81px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(160, 32, 240); border-width: 2px; --shadow-rgb: rgb(160,32,240);",
				},
				{
					emoji: "❓",
					text: '"q"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(81, 65, 79) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 124; height: 43px; width: 72px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(81, 65, 79); border-width: 2px; --shadow-rgb: rgb(81,65,79);",
				},
				{
					emoji: "🤔",
					text: '"r"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(255, 0, 0) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 128; height: 43px; width: 78px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(255, 0, 0); border-width: 2px; --shadow-rgb: rgb(255,0,0);",
				},
				{
					emoji: "🐍",
					text: '"s"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(250, 128, 114) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 132; height: 43px; width: 78px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(250, 128, 114); border-width: 2px; --shadow-rgb: rgb(250,128,114);",
				},
				{
					emoji: "🤔",
					text: '"z"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(0, 20, 168) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 136; height: 43px; width: 80px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(0, 20, 168); border-width: 2px; --shadow-rgb: rgb(0,20,168);",
				},
				{
					emoji: "🕒",
					text: '"t"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(0, 128, 128) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 140; height: 43px; width: 77px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(0, 128, 128); border-width: 2px; --shadow-rgb: rgb(0,128,128);",
				},
				{
					emoji: "👍",
					text: '"u"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(4, 55, 242) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 145; height: 43px; width: 78px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(4, 55, 242); border-width: 2px; --shadow-rgb: rgb(4,55,242);",
				},
				{
					emoji: "❌",
					text: '"x"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(241, 180, 47) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 149; height: 43px; width: 80px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(241, 180, 47); border-width: 2px; --shadow-rgb: rgb(241,180,47);",
				},
				{
					emoji: "🤔",
					text: '"y"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(255, 255, 0) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 153; height: 43px; width: 80px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(255, 255, 0); border-width: 2px; --shadow-rgb: rgb(255,255,0);",
				},
				{
					emoji: "🤔",
					text: '"z"',
					span: true,
					spanCss: "color: color-mix(in srgb, rgb(0, 20, 168) 40%, rgb(255, 255, 255));",
					style:
						"translate: 0px; z-index: 157; height: 43px; width: 80px; border-radius: 10px; animation: auto ease 0s 1 normal none running none; transition: none 0s ease 0s; box-shadow: var(--x-offset) var(--y-offset) var(--radius) var(--spread) color-mix(in srgb,var(--shadow-rgb),  transparent 70%),\n			 inset 0 0 20px  color-mix(in srgb, var(--shadow-rgb), transparent 70%); border-color: rgb(0, 20, 168); border-width: 2px; --shadow-rgb: rgb(0,20,168);",
				},
			],
		};
		let alpbabethFolder = alphabetData["a"];
		console.log("alphanumerics:", alpbabethFolder);
		console.log("folderStruct", foldersData);

		if (folders.includes("alphabets")) {
			if (!("alphabets" in foldersData)) foldersData["alphabets"] = [];

			for (let elm of alpbabethFolder) {
				console.log("elm", elm);
				console.log(
					"filterd:",
					foldersData["alphabets"].filter((item) => item.text == elm.text)
				);
				if (foldersData["alphabets"].filter((item) => item.text == elm.text).length == 0) {
					console.log("this is true");
					foldersData["alphabets"].push(elm);
				}
			}
			localStorage.setItem("folderStructure", JSON.stringify(foldersData));
			// buildFolder();
		}
	}

	function getElementToSave(cloneElement, discovered = false) {
		let text = "";
		let spanCss = "";

		let span = false;

		text = cloneElement.childNodes[1]?.textContent?.trim();

		if (cloneElement.querySelector(".addspan")) {
			span = true;
			spanCss = cloneElement.querySelector(".addspan").style.cssText;
      text="";
      var spans=Array.from(cloneElement.childNodes);
       spans=spans.slice(1);
      for(let span of spans)
       {
         text+=span.textContent;
       }

		}

		console.log("text is:", text);

		let elementToSave = {
			emoji: cloneElement.childNodes[0]?.textContent?.trim(),
			text: text,
			discovered: discovered,
			span: span,
			spanCss: spanCss,
			style: cloneElement.style.cssText,
		};
		return elementToSave;
	}

	function AtIntersection(element1, element2) {
		console.log("intersection happends");

		const rect1 = element1.getBoundingClientRect();
		const rect2 = element2.getBoundingClientRect();

		console.log("atinter el1", element1);

		if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y) {
			let cloneElement = element1.cloneNode(true);

			cloneElement.id="";

			cloneElement.style.translate = "0px 0px";
			cloneElement.style.display = "inline-block";
			let elementToSave = null;
			let discovered = false;
			if (cloneElement.classList.contains("instance-discovered")) {
				console.log("this thing");

				cloneElement.className = "";
				cloneElement.style.transform = "";
				cloneElement.classList.add("item");
				cloneElement.classList.add("item-discovered");
				discovered = true;
			}

		    cloneElement.style.scale = 0.9;
		  	cloneElement.children[0].style.fontSize = '20px';

			elementToSave = getElementToSave(cloneElement, discovered);

			if (cloneElement.classList.contains("instance")) {
				cloneElement.className = "";
				cloneElement.classList.add("item");
			}



      var added=false;
			if (element2.children[0].children[0].textContent in foldersData) {
     	var found=foldersData[element2.children[0].children[0].textContent].find(x=>x.text==elementToSave.text)
      if(found==null)
        {
          			foldersData[element2.children[0].children[0].textContent].push(elementToSave);
                added=true;
        }
			} else {
				foldersData[element2.children[0].children[0].textContent] = [];
				foldersData[element2.children[0].children[0].textContent].push(elementToSave);
        added=true;
			}
         if(added){
			localStorage.setItem("folderStructure", JSON.stringify(foldersData));

			cloneElement.addEventListener("mousedown", (e) => {
				let element = getElementToSave(cloneElement, discovered);
				console.log("element:", element);

				console.log(e);

				if (e.shiftKey) {
					foldersData[element2.children[0].children[0].textContent] = foldersData[element2.children[0].children[0].textContent].filter((item) => item.text != element.text);
					localStorage.setItem("folderStructure", JSON.stringify(foldersData));
					buildFolder(element2);
				} else {
					console.log("hello405", element);
					const randomX = getRandomPosition(400, 800);
					const randomY = getRandomPosition(300, 600);
					IC.createInstance({
						"text": element.text,
						"emoji": element.emoji,
						"x": randomX,
						"y": randomY,
					})
				}
			});

			element2.appendChild(cloneElement);
         }
		}
	}

	function elementToItem(element, folderName = null, folderInstance = null) {
		let item = document.createElement("div");

		item.classList.add("item");
		const itemEmoji = document.createElement("span");
		itemEmoji.classList.add("item-emoji");
		itemEmoji.appendChild(document.createTextNode(element.emoji ?? "⬜"));

		item.appendChild(itemEmoji);
		item.style.cssText = element.style;

		if (element.span == false) {
			item.appendChild(document.createTextNode(` ${element.text} `));
		} else {
			let text = "";
			for (const char of element.text) {
				if (char >= "A" && char <= "Z") {
					text += char;
				} else {
					if (char == '"') {
						if (text != "") {
							item.appendChild(document.createTextNode(text));
							text = "";
						}

						let spn = document.createElement("span");
						spn.classList.add("addspan");
						spn.textContent = '"';
						spn.style.cssText = element.spanCss;
						item.appendChild(spn);
					} else {
						text += char;
					}
				}
			}
			if (text != "") {
				item.appendChild(document.createTextNode(text));
				text = "";
			}
		}
		item.style.display = "inline-block";
		item.addEventListener("mousedown", (e) => {
			console.log(e);
			if (folderName == null) folderName = folders[mode];
			if (!e.shiftKey) {
				console.log("hello458", element);

				const randomX = getRandomPosition(400, 800);
				const randomY = getRandomPosition(300, 600);
				IC.createInstance({
					"text": element.text,
					"emoji": element.emoji,
					"x": randomX,
					"y": randomY,
				})
			} else {
				foldersData[folderName] = foldersData[folderName].filter((item) => item.text != element.text);
				localStorage.setItem("folderStructure", JSON.stringify(foldersData));
				buildFolder(folderInstance);
			}
		});
		return item;
	}


	function getRandomPosition(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}


	function populateFolder(folderName, localFolder = null) {
		if (localFolder == null) localFolder = currentFolder;

		console.log("populate folder:", foldersData, "folder name:", folderName);

		if (foldersData != null && folderName in foldersData) {
			console.log("the folders structure:", foldersData[folderName]);

			for (let el of foldersData[folderName]) {
				let item = elementToItem(el, folderName, localFolder);
				localFolder.appendChild(item);
			}
		}
	}

	function buildFolder(localFolder = null) {
		console.log("build folder");
		let parentSidebar = document.getElementsByClassName("folders")[0];
		let currentFolderName = null;
		let nameOfFolder = null;

		if (localFolder == null) {

      var folderWrapper= document.createElement("div");
   folderWrapper.style.display="flex";
   folderWrapper.style.position = "sticky"
   folderWrapper.style.flexDirection="column";


			localFolder = document.createElement("div");
			localFolder.classList.add("folder");
      folderWrapper.appendChild(localFolder);
			currentFolderName = document.createElement("div");
			currentFolderName.classList.add("folderName");
			nameOfFolder = document.createElement("span");
			nameOfFolder.textContent = folders[mode];
			currentFolderName.appendChild(nameOfFolder);
			currentFolderName.style.display = "block";
			localFolder.appendChild(currentFolderName);

			localFolder.style.width = "100%";
			localFolder.style.height = folderSizes[folders[mode]];
      if(localFolder.style.height==null)
        {
           localFolder.style.height="200px"
           folderSizes[folders[mode]]=200;
           localStorage.setItem("folderSizes", JSON.stringify(folderSizes));

        }else
      {
        localFolder.style.height+="px";

      }



			localFolder.style.zIndex = "1";
			localFolder.style.overflowX = "scroll";

			currentFolder = localFolder;

			nameOfFolder.style.float = "left";

			currentFolderName.style.zIndex = "2";

			currentFolderName.style.width = "100%";
			currentFolderName.style.height = "40px";
			currentFolderName.style.position = "sticky";
			currentFolderName.style.top = "0px";
			let cleanP = document.createElement("span");
			let deleteFolderP = document.createElement("span");
			let minimizeMaximize = document.createElement("span");
			let closeWindow = document.createElement("span");

			closeWindow.style.float = "left";
			closeWindow.style.fontSize = "x-large";
			closeWindow.textContent = "❌";
			closeWindow.style.marginLeft = "10px";
			closeWindow.addEventListener("mouseover", function () {
				console.log("over maximize");
				closeWindow.style.textShadow = "red 2px 0 20px";
				closeWindow.style.backgroundColor = "red";
			});
			closeWindow.addEventListener("mouseout", function () {
				closeWindow.style.textShadow = "";
				closeWindow.style.backgroundColor = "transparent";
			});

			closeWindow.addEventListener("click", function () {
				parentSidebar.removeChild(folderWrapper);
        openedFolders--;
        if(openedFolders<=0)
          {
           let foldersDiv = document.querySelector(".folders");
            foldersDiv.style.height=0+"px";
          }
			});

     let randomButton=document.createElement("span");
      randomButton.style.float = "left";
      randomButton.style.fontSize = "x-large";
		  randomButton.textContent = "❔";
      randomButton.style.marginLeft = "10px";
      randomButton.addEventListener("mouseover", function () {
				console.log("over random");
			  randomButton.style.textShadow = "red 2px 0 20px";
				randomButton.style.backgroundColor = "red";
			});
			randomButton.addEventListener("mouseout", function () {
				randomButton.style.textShadow = "";
				randomButton.style.backgroundColor = "transparent";
			});
	  randomButton.addEventListener("click", function () {
      if(foldersData[nameOfFolder.textContent]!=null && foldersData[nameOfFolder.textContent].length>0)
        {
      var element=foldersData[nameOfFolder.textContent][Math.floor(Math.random() *  foldersData[nameOfFolder.textContent].length)];

					const randomX = getRandomPosition(400, 800);
					const randomY = getRandomPosition(300, 600);
					IC.createInstance({
						"text": element.text,
						"emoji": element.emoji,
						"x": randomX,
						"y": randomY,
					})
        }
			});

			minimizeMaximize.style.float = "left";
			minimizeMaximize.style.fontSize = "x-large";
			minimizeMaximize.textContent = "🗕";
			minimizeMaximize.style.marginLeft = "10px";
			minimizeMaximize.addEventListener("mouseover", function () {
				console.log("over maximize");
				minimizeMaximize.style.textShadow = "blue 2px 0 20px";
				minimizeMaximize.style.backgroundColor = "lightblue";
			});
			minimizeMaximize.addEventListener("mouseout", function () {
				minimizeMaximize.style.textShadow = "";
				minimizeMaximize.style.backgroundColor = "transparent";
			});

			minimizeMaximize.addEventListener("click", function () {
				if (	minimizeMaximize.textContent=="🗕") {
					localFolder.style.height = "45px";
					minimizeMaximize.textContent = "🗖";
				} else {
					localFolder.style.height = 	folderSizes[nameOfFolder.textContent]+"px";
					minimizeMaximize.textContent = "🗕";
				}
			});

			cleanP.style.float = "right";
			deleteFolderP.style.float = "right";
			cleanP.style.fontSize = "x-large";
			deleteFolderP.style.fontSize = "x-large";
			cleanP.textContent = "🧹 ";
			deleteFolderP.textContent = "🗑️";

			cleanP.addEventListener("mouseover", function () {
				cleanP.style.textShadow = "red 1px 0 20px";
			});

			deleteFolderP.addEventListener("mouseover", function () {
				deleteFolderP.style.textShadow = "red 1px 0 20px";
			});
			cleanP.addEventListener("mouseout", function () {
				// cleanP.style.color="transparent";
				cleanP.style.textShadow = "";
			});

			deleteFolderP.addEventListener("mouseout", function () {
				// cleanP.style.color="transparent";
				deleteFolderP.style.textShadow = "";
			});

			cleanP.addEventListener("click", function () {
				confirmPrompt(function () {
					console.log("NAME OF FOLDER:", nameOfFolder.textContent);
					foldersData[nameOfFolder.textContent] = [];

					localStorage.setItem("folderStructure", JSON.stringify(foldersData));

					buildFolder(localFolder);
				}, "Deleting  all content");
			});
			deleteFolderP.addEventListener("click", function () {
				confirmPrompt(function () {
					for (let f of document.querySelectorAll(".folder")) {
						if (f.children[0].children[0].textContent == localFolder.children[0].children[0].textContent) parentSidebar.removeChild(f);
					}

					delete foldersData[nameOfFolder.textContent];
					folders = folders.slice(0, folders.indexOf(nameOfFolder.textContent)).concat(folders.slice(folders.indexOf(nameOfFolder.textContent) + 1));
					mode = 0;
					console.log("folders:", folders);

					localStorage.setItem("folderStructure", JSON.stringify(foldersData));
					localStorage.setItem("foldersNames", JSON.stringify(folders));

					//buildFolder(localFolder);
					if (ParentSource.contains(ThemeButton)) ParentSource.removeChild(ThemeButton);
					set_up_Folder_create_button();
				}, "Deleting folder");
			});

			currentFolderName.appendChild(minimizeMaximize);
			currentFolderName.appendChild(closeWindow);
      currentFolderName.appendChild(randomButton);
			currentFolderName.appendChild(cleanP);

			currentFolderName.appendChild(deleteFolderP);

			localFolder.appendChild(document.createElement("br"));


			parentSidebar.insertBefore(folderWrapper,parentSidebar.children[0]);

		} else {
			currentFolderName = localFolder.children[0];
			nameOfFolder = currentFolderName.children[0];
      localFolder.style.height = folderSizes[folders[mode]];
      if(localFolder.style.height==null)
        {
           localFolder.style.height="200px"
           folderSizes[folders[mode]]=200;
           localStorage.setItem("folderSizes", JSON.stringify(folderSizes));

        }else
      {
        localFolder.style.height+="px";

      }

			while (localFolder.firstChild) {
				localFolder.firstChild.remove();
			}
			localFolder.appendChild(currentFolderName);
		}

		populateFolder(nameOfFolder.textContent, localFolder);
    var finalDiv=document.createElement("div");
    finalDiv.style.cursor="ns-resize";
    finalDiv.style.height="3px";
	  finalDiv.style.width="100%";
    finalDiv.style.position="sticky";
    finalDiv.style.top="100%";
    let resizingLocal = false;
    let startYLocal=0;
    let startHeight =localFolder.offsetHeight;
    finalDiv.addEventListener("mousedown",(e)=>{
    resizingLocal  = true;
		startYLocal = e.clientY;
		startHeight =localFolder.offsetHeight;
   function handleResize(e) {
		if (!resizingLocal ) return;
		const newHeight = startHeight + e.clientY - startYLocal;
    if(newHeight<45)
       newHeight=45;
    folderSizes[nameOfFolder.textContent]=newHeight;
    localStorage.setItem("folderSizes",JSON.stringify(folderSizes));
		localFolder.style.height=newHeight+"px";
    }
    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", function() {
			document.removeEventListener("mousemove", handleResize);
		});
    });

    folderWrapper.appendChild(finalDiv);
		console.log("Parent:", parentSidebar);
	}

	function injectCSS() {
		let css = `
		.theme_settings_opt {
			overflow-y: scroll;
			scrollbar-width: none; /* Firefox */
			-ms-overflow-style: none; /* Internet Explorer 10+ */
		}
		.theme_settings_opt::-webkit-scrollbar {
			/* WebKit */
			width: 0;
			height: 0;
		}

		.folders {
			overflow-y: scroll;
			scrollbar-width: none; /* Firefox */
			-ms-overflow-style: none; /* Internet Explorer 10+ */
		}
		.folders::-webkit-scrollbar {
			/* WebKit */
			width: 0;
			height: 0;
		}

		.folderName {
			background-color: #666;
			color: var(--text-color);
		}

		.folder {
			border: var(--instance-border) 2px solid;
			overflow-y: scroll;
			color: var(--text-color);
			background-color: var(--background-color);

			scrollbar-width: none; /* Firefox */
			-ms-overflow-style: none; /* Internet Explorer 10+ */
		}
		.folder::-webkit-scrollbar {
			/* WebKit */
			width: 0;
			height: 0;
		}

		.sidebar-header {
			z-index: 100 !important;
		}

		.item, .item-emoji {
			font-size: 16.4px;
		}

		`;

		let style = document.createElement("style");
		style.appendChild(document.createTextNode(css.trim()));
		document.getElementsByTagName("head")[0].appendChild(style);
	}

	function switchTheStyle() {

    if(openedFolders==0)
      {
        		let foldersDiv = document.querySelector(".folders");
            foldersDiv.style.height=foldersSize+"px";
      }
    openedFolders++;
    	buildFolder();
	}

	function set_up_Folder_create_button() {

		let menu = document.querySelector(".menu");
		menu.addEventListener("click", () => {
			let interval = setInterval(
				() => {

					let settings = document.querySelector(".modal-tabs");
					if (settings == null)
						return;

					clearInterval(interval);

					let modal1 = document.querySelector(".modal");
					modal1.style.maxWidth = "650px";
					let theme_settings_container = document.createElement("div");
					ThemeButton = theme_settings_container;
					if (settings == null) {


						settings = document.querySelector(".container");
						theme_settings_container.style.position = 'absolute';
						theme_settings_container.style.left = '20px';
						theme_settings_container.style.top = '100px';
						theme_settings_container.style.width = '50px';
						theme_settings_container.style.height = '50px';

						theme_settings_container.classList.add('theme_settings_cont');



					}
					else {
						theme_settings_container.classList.add('setting');
						theme_settings_container.classList.add("modal-tab-wrapper");
						theme_settings_container.setAttribute("data-v-885fff84", "");
						theme_settings_container.classList.add("folder_settings_cont");
						ParentSource = settings;
					}



					var title = document.createElement("div");


					title.classList.add("modal-tab");
					title.setAttribute("data-v-885fff84", "");
					var textSpacer = document.createElement("div");
					var textDiv = document.createElement("div");
					textDiv.classList.add("modal-tab-text");
					textDiv.textContent = "Folder Settings 📁";
					textDiv.setAttribute("data-v-885fff84", "");
					textSpacer.textContent = "/";
					textSpacer.classList.add('spacer');
					textSpacer.setAttribute("data-v-885fff84", "");
					theme_settings_container.appendChild(textSpacer);
					title.appendChild(textDiv);

					theme_settings_container.appendChild(title);
					settings.appendChild(theme_settings_container);
					var parentElement = document.querySelector(".modal");


					title.addEventListener("click", () => {

						while (parentElement.children[1].children.length > 1)
							parentElement.children[1].removeChild(parentElement.children[1].lastChild);
						if (parentElement.children[1].lastChild && parentElement.children[1].lastChild.style) {
							parentElement.children[1].lastChild.style.display = "none";
						} else
							if (parentElement.children[1].lastChild) {
								parentElement.children[1].children[0].style.display = "none";
							}

						title.classList.add("modal-tab-selected");

						var titleTabs = document.querySelector(".modal-tabs");
            var content = document.querySelector(".folder-setting-content");
            if (content == null) {

			          content = document.createElement("div");
			          content.setAttribute("data-v-885fff84", "");
			          content.classList.add("about");

			          content.classList.add("folder-setting-content");
			          parentElement.appendChild(content);

		          }else
                {
                   content.innerHTML = "";
                }

						for (var tab of titleTabs.children) {

							if (tab.querySelector(".modal-tab").querySelector(".modal-tab-text").textContent != title.textContent) {
								tab.querySelector(".modal-tab").addEventListener("click", () => {

									title.classList.remove("modal-tab-selected");
									if (parentElement.contains(content)) {
										parentElement.removeChild(content);
									}
								})
							}


						}
						updateContent();

					});
				}, 1);
		});

	}
	function updateContent() {
		var content = document.querySelector(".folder-setting-content");
    var parentElement = document.querySelector(".modal");
    content.innerHTML = "";

		var selected = document.querySelectorAll(".modal-tab-selected");
		selected.forEach(x => x.classList.remove("modal-tab-selected"));



		let optionsdiv = document.createElement("div");
		let selectedP = document.createElement("span");

		selectedP.textContent = folders[mode];
		selectedPrompt = selectedP;

		//optionsdiv.classList.add("theme_settings_opt");
		let dropdown = optionsdiv;

		optionsdiv.style.height = "200px";

		optionsdiv.style.overflowY = "auto";
		dropdown.id = "dropdown_theme";

		let index = 0;

		for (let f of folders) {
			let option = document.createElement("p");
			option.classList.add("theme");
			option.addEventListener(
				"click",
				function (event, index, optionsdiv) {
					console.log("event:", event);
					console.log("index:", index);
					console.log("opt:", optionsdiv);

					optionsdiv.stopPropagation();
					console.log("index:", event);

					previousmode = mode;
					mode = event;
					selectedP.textContent = folders[mode];
					option.style.whiteSpace = "nowrap";
					option.style.overflow = "hidden";

					console.log("optdiv:", optionsdiv);
					console.log("fatherButton:", ThemeButton);
					if (!existsFolder(folders[mode])) switchTheStyle();
				}.bind(event, index, optionsdiv)
			);

			option.textContent = f;
			option.style.whiteSpace = "nowrap";
			option.style.overflow = "hidden";
			//option.style.textOverflow="ellipsis";

			optionsdiv.appendChild(option);

			index = index + 1;
		}

		dropMenu = optionsdiv;
		let selectionDiv = document.createElement("div");
		selectionDiv.id = 'selectionDiv';


		selectedP.addEventListener(
			"click",
			function () {
				selectionDiv.appendChild(optionsdiv);
				hidden = 1;
			},
			false
		);

		selectionDiv.appendChild(selectedP);
		selectionDiv.appendChild(document.createElement("hr"));
		let makeButton = document.createElement("button");
		makeButton.textContent = "New";
		makeButton.style.maxHeight = "50px";
		makeButton.style.marginBottom = "50px";
		makeButton.addEventListener("click", function () {
			let parent = document.querySelector(".container");

			let dialog = document.createElement("dialog");
			let label = document.createElement("label");
			let input = document.createElement("input");
			let saveButton = document.createElement("button");
			let closeButton = document.createElement("button");
			label.textContent = "Choose a folder name unused";
			closeButton.textContent = "Close without saving";
			saveButton.textContent = "Save";

			saveButton.addEventListener("click", function () {
				let name = input.value;
				if (!folders.includes(name)) folders.push(name);

				localStorage.setItem("foldersNames", JSON.stringify(folders));
				let settings = ParentSource;
				updateContent();
				dialog.close();
			});

			closeButton.addEventListener("click", function () {
				updateContent();
				dialog.close();
			});
			dialog.appendChild(label);
			dialog.appendChild(document.createElement("br"));
			dialog.appendChild(document.createElement("br"));
			dialog.appendChild(input);
			dialog.appendChild(document.createElement("br"));
			dialog.appendChild(document.createElement("br"));
			dialog.appendChild(saveButton);
			dialog.appendChild(document.createElement("br"));
			dialog.appendChild(closeButton);
			dialog.style.position = "absolute";
			dialog.style.top = "33%";
			dialog.style.left = "25%";
			dialog.style.background = window.getComputedStyle(document.querySelector(".container")).getPropertyValue("--background-color").trim();
			dialog.style.color = window.getComputedStyle(document.querySelector(".container")).getPropertyValue("--text-color").trim();

			parent.appendChild(dialog);
			dialog.showModal();
		});

		content.appendChild(makeButton);

		if (!content.contains(selectionDiv)) content.appendChild(selectionDiv);

	}
	function initFolders() {
		if (localStorage.getItem("foldersNames") != null) {
			folders = JSON.parse(localStorage.getItem("foldersNames"));
		}
if (localStorage.getItem("foldersContainerSize") != null) {
			foldersSize = JSON.parse(localStorage.getItem("foldersContainerSize"));
		}
		if (localStorage.getItem("folderStructure") != null) {
			foldersData = JSON.parse(localStorage.getItem("folderStructure"));
			console.log(foldersData);
		} else {
			foldersData = {};
		}
if (localStorage.getItem("folderSizes") != null) {
			folderSizes = JSON.parse(localStorage.getItem("folderSizes"));
		}
		const instanceObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				console.log("mutation:", mutation);
				if (mutation.addedNodes.length > 0) {
					for (const node of mutation.addedNodes) {
						if (node.id != "instance-0" && !node.classList.contains("background-instance")) {
							node.addEventListener("mouseup", (event) => {
								console.log(event.clientX, event.clientY);
								for (let folder of document.querySelectorAll(".folder")) AtIntersection(node, folder);
							});
						}
					}
				}
			}
		});

		instanceObserver.observe(document.getElementById("instances"), {
			childList: true,
			subtree: true,
		});

		let parentFolders = document.getElementsByClassName("sidebar-inner")[0];
		let foldersDiv = document.createElement("div");
		foldersDiv.classList.add("folders");
		foldersDiv.style.width = "100%";
		foldersDiv.style.zIndex = "1";
		foldersDiv.style.overflow = "auto";
    foldersDiv.style.height=0+"px";

    var resizeFolders=document.createElement("div");
    resizeFolders.style.cursor="ns-resize";
    resizeFolders.style.height="3px";
	  resizeFolders.style.width="100%";
    let resizing = false;
    let startY=0;
    let startHeight =foldersDiv.offsetHeight;
    resizeFolders.addEventListener("mousedown",(e)=>{
    resizing = true;
		startY = e.clientY;
		startHeight = foldersDiv.offsetHeight;
   function handleResize(e) {
		if (!resizing) return;
		const newHeight = startHeight + e.clientY - startY;
    foldersSize=newHeight;
    localStorage.setItem("foldersContainerSize",foldersSize);
		foldersDiv.style.height=newHeight+"px";

	}
		document.addEventListener("mousemove", handleResize);
		document.addEventListener("mouseup", function() {
			resizing = false;
			document.removeEventListener("mousemove", handleResize);
		});
    });

    var foldersWrapper= document.createElement("div");
    foldersWrapper.style.display="flex";
    foldersWrapper.style.position = "sticky"
    foldersWrapper.style.flexDirection="column";
    foldersWrapper.appendChild(foldersDiv);
    foldersWrapper.appendChild(resizeFolders);
    foldersWrapper.style.border="1px solid var(--border-color)";
		parentFolders.insertBefore(foldersWrapper, document.getElementsByClassName("items")[0]);
	}
	window.addEventListener(
		"load",
		async () => {
			console.log("Welcome to themes");
			injectCSS();
			initFolders();
			initTheAlphabeth();
			set_up_Folder_create_button();
		},
		false
	);
})();
