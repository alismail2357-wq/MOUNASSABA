//constantRefresh
function constantRefresh(activationStroke, deactivationStroke) {
    let active = false;
    let intervalID = null;
    let lastKey = null;
    let lastTime = 0;

    function pressEnterInPagerInput() {
        const boxy = document.getElementsByClassName("ui-pg-input");
        if (boxy.length === 0) return;
        const input = boxy[0];
        const event = new KeyboardEvent("keypress", {
            bubbles: true,
            cancelable: true,
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13
        });
        input.dispatchEvent(event);
    }

    function activate() {
        if (active) return;
        active = true;
        intervalID = setInterval(() => {
            pressEnterInPagerInput();
        }, 500);
        console.log("Auto Refresh → ACTIVATED");
    }

    function deactivate() {
        if (!active) return;
        active = false;
        clearInterval(intervalID);
        intervalID = null;
        console.log("Auto Refresh → DEACTIVATED");
    }

    document.addEventListener("keydown", (e) => {
        const now = Date.now();
        const isDouble = (e.key === lastKey && now - lastTime < 300);
        if (isDouble) {
            if (e.key === activationStroke) activate();
            if (e.key === deactivationStroke) deactivate();
        }
        lastKey = e.key;
        lastTime = now;
    });
}

//killModal19
function killModal19() {
    setInterval(() => {
        const modals = document.getElementsByClassName("modal-dialog");
        if (modals.length > 19) {
            let modal19 = modals[19];
            if (modal19 && modal19.parentNode) {
                modal19.parentNode.removeChild(modal19);
                console.log("Modal 19 removed");
            }
        }
        const backdrops = document.getElementsByClassName("modal-backdrop");
        while (backdrops.length > 0) {
            if (backdrops[0].parentNode) {
                backdrops[0].parentNode.removeChild(backdrops[0]);
                console.log("Backdrop removed");
            }
        }
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "auto";
    }, 100);
}

//constantClaim
function constantClaim(activationStroke, deactivationStroke) {
    let active = false;
    let intervalID = null;
    let lastKey = null;
    let lastTime = 0;

    function runClaimFlow() {
        const claimBtn = document.querySelector("#claimTask");
        if (!claimBtn) return;
        claimBtn.click();

        const waitForConfirm = setInterval(() => {
            const confirm = document.querySelector(
                "body > div.bootbox.modal.fade.bootbox-confirm.in > div > div > div.modal-footer > button.btn.btn-primary"
            );
            if (confirm) {
                clearInterval(waitForConfirm);
                confirm.click();
                const waitForOK = setInterval(() => {
                    const ok = document.querySelector(
                        "body > div.bootbox.modal.fade.bootbox-alert.in > div > div > div.modal-footer > button"
                    );
                    if (ok) {
                        clearInterval(waitForOK);
                        ok.click();
                        const waitForSuccess = setInterval(() => {
                            const success = document.querySelector(
                                "body > div.bootbox.modal.fade.bootbox-alert.in > div > div > div.modal-footer > button"
                            );
                            if (success) {
                                clearInterval(waitForSuccess);
                                success.click();
                            }
                        }, 10);
                    }
                }, 10);
            }
        }, 10);
    }

    function activate() {
        if (active) return;
        active = true;
        intervalID = setInterval(() => {
            runClaimFlow();
        }, 500);
        console.log("Constant Claim ➜ ACTIVATED");
    }

    function deactivate() {
        if (!active) return;
        active = false;
        clearInterval(intervalID);
        intervalID = null;
        console.log("Constant Claim ➜ DEACTIVATED");
    }

    document.addEventListener("keydown", (e) => {
        const now = Date.now();
        const doublePressed = (e.key === lastKey && now - lastTime < 300);
        if (doublePressed) {
            if (e.key === activationStroke) activate();
            if (e.key === deactivationStroke) deactivate();
        }
        lastKey = e.key;
        lastTime = now;
    });
}

//PANEL
function applyDynamicCommuneRules(theCase) {
  const rules = JSON.parse(localStorage.getItem("gammaRules") || "[]");
  for (const { from, to } of rules) {
    if (theCase.value === from) {
      theCase.value = to;
      return;
    }
  }
}

const gammaKeys = JSON.parse(localStorage.getItem("gammaKeys") || "{}");
const claimKey = gammaKeys.claimKey || "c";
const communeKey = gammaKeys.communeKey || "shift";
const cityCycleKey = gammaKeys.cityCycleKey || "control";

//GLOBALS 
let countToday=0;

//n min checking 
function checkTimeWithinNMinutes(timingString, n) {
  const parts = timingString.trim().split(' ');
  if (parts.length !== 2) return false;
  const [datePart, timePart] = parts;
  const [day, month, year] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  const inputDate = new Date(year, month - 1, day, hours, minutes);
  if (isNaN(inputDate.getTime())) return false;
  const now = new Date();
  const diffMs = Math.abs(now - inputDate);
  const diffMinutes = diffMs / (1000 * 60);
  return diffMinutes <= n;
}

//Key Pressed
function charPress(char, ctrlReq, callback) {
  document.addEventListener('keydown', (event) => {
    const pressedChar = event.key.toLowerCase();
    const targetChar = char.toLowerCase();
    if (ctrlReq) {
      if (event.ctrlKey && pressedChar === targetChar) {
        callback();
      }
    } else {
      if (!event.ctrlKey && pressedChar === targetChar) {
        callback();
      }
    }
  });
}

charPress("c", false, () => {
    const taskList = document.getElementsByClassName("ui-widget-content jqgrow ui-row-ltr");
    for (const task of taskList) {
        let timingString = task.children[13].innerText;
        if (checkTimeWithinNMinutes(timingString, 15)) {
            task.children[0].click();
        }
    }
    const claimBtn = document.querySelector("#claimTask");
    if(claimBtn) claimBtn.click();

    const waitForConfirm = setInterval(() => {
        const confirm = document.querySelector(
            "body > div.bootbox.modal.fade.bootbox-confirm.in > div > div > div.modal-footer > button.btn.btn-primary"
        );
        if (confirm) {
            clearInterval(waitForConfirm);
            confirm.click();
            const waitForOK = setInterval(() => {
                const ok = document.querySelector(
                    "body > div.bootbox.modal.fade.bootbox-alert.in > div > div > div.modal-footer > button"
                );
                if (ok) {
                    clearInterval(waitForOK);
                    ok.click();
                    const waitForSuccess = setInterval(() => {
                        const success = document.querySelector(
                            "body > div.bootbox.modal.fade.bootbox-alert.in > div > div > div.modal-footer > button"
                        );
                        if (success) {
                            clearInterval(waitForSuccess);
                            success.click();
                        }
                    }, 10);
                }
            }, 10);
        }
    }, 10);
});

constantClaim("Enter", "0");
constantRefresh("4", "5");

charPress("+",false,()=>{
 let approveBtn = document.querySelector('#submitEditPrepaidID');
 if(approveBtn) approveBtn.click();
 setTimeout(()=>{
  let okApprove = document.querySelector('body > div.bootbox.modal.fade.bootbox-confirm.in > div > div > div.modal-footer > button.btn.btn-primary');
  if(okApprove) okApprove.click();
 },200);
 countToday++;
 console.log(countToday);
});

charPress("shift",false,()=>{
    let communes = document.getElementsByClassName('select2-chosen');
    if(!communes[1]) return;
    let communeValue=communes[1].innerText;
    let theCase = document.querySelector('#address1');
    if(!theCase) return;
    theCase.value=communeValue;
    theCase.value = theCase.value.replace(/-/g, ' ').replace(/'/g, '').replace(/\//g, ' ').replace(/é/g, 'e');

    // Mappings
    if (theCase.value === "Les Eucaliptus/ Cherarba") theCase.value = "Les Eucaliptus";
    if (theCase.value === "B E Bahri") theCase.value = "Bordj El Bahri";
    if (theCase.value === "O Fayet") theCase.value = "Ouled Fayet";
    if (theCase.value === "BIR KADEM R1 TEXRIANE R3") theCase.value = "BIR KADEM";
    if (theCase.value === "Staoueli R2") theCase.value = "Staoueli";
    if (theCase.value === "Reghaia R1") theCase.value = "Reghaia";
    if (theCase.value === "Bologhine R1") theCase.value = "Bologhine Ben Ziri";
    if (theCase.value === "DOUERA R2") theCase.value = "Douera";
    if (theCase.value === "El Kennar") theCase.value = "El Kennar Nouchfi";
    if (theCase.value === "DRARIA R2") theCase.value = "Draria";
    if (theCase.value === "Alger Haute Casbah R1") theCase.value = "Casbah";
    if (theCase.value === "Dely ibrahim R2") theCase.value = "Dely Ibrahim";
    if (theCase.value === "Mohammadia R2") theCase.value = "Mohammadia";
    if (theCase.value === "KHRAISSIA R3") theCase.value = "Khraissia";
    if (theCase.value === "Bordj el Kiffan Faizi") theCase.value = "Bordj El Kifan";
    if (theCase.value === "KOUBA RCE") theCase.value = "Kouba";
    if (theCase.value === "SAOULA R3") theCase.value = "Saoula";
    if (theCase.value === "BABA HASSEN R3") theCase.value = "Baba Hassen";
    if (theCase.value === "BACHDJARAH R1") theCase.value = "BACHDJARAH";
    if (theCase.value === "BENI MESSOUS R2") theCase.value = "Beni Messous";
    if (theCase.value === "Staoueli C ") theCase.value = "Staoueli";
    if (theCase.value === "AYN TAYA R1") theCase.value = "Ayn Taya";
    if (theCase.value === "HYDRA RHC") theCase.value = "Hydra";
    if (theCase.value === "EL ACHOUR R4") theCase.value = "El Achour";
    if (theCase.value === "OUED EL SEMAR R2") theCase.value = "Oued El Semar";
    if (theCase.value === "Alger Mohamed V") theCase.value = "Mohammed Belouizdad";
    if (theCase.value === "BARAKI BAR SI LAKHDAR R3") theCase.value = "Baraki";
    if (theCase.value === "ALGER SIDI M HAMED") theCase.value = "SIDI M HAMED";
    if (theCase.value === "Souidania R3") theCase.value = "Souidania";
    if (theCase.value === "Constantine El Gamas") theCase.value = "El Gamas";
    if (theCase.value === "Les Eucaliptus Cherarba") theCase.value = "Les Eucaliptus";
    if (theCase.value === "Constantine Cite Ziadia") theCase.value = "Ziadia";
    if (theCase.value === "Constantine RP" || theCase.value === "Constantine Wilaya") theCase.value = "Constantine";
    if (theCase.value === "Constantine Sidi Mabrouk") theCase.value = "Sidi Mabrouk";
    if (theCase.value === "Constantine Coudiat") theCase.value = "Boudraa Saleh";
    if (theCase.value === "IBN BADIS") theCase.value = "IBN BADIS El Haria";
    if (theCase.value === "Oran Hai Badr") theCase.value = "El Badr";
    if (theCase.value === "Oran el Hamri") theCase.value = "El Hamri";
    if (theCase.value === "Oran el Makkari") theCase.value = "El Makkari";
    if (theCase.value === "Oran Ibn Sinna") theCase.value = "Ibn Sinna";
    if (theCase.value === "Ain Beida Djebel Halfa") theCase.value = "Ain Beida Harriche";
    if (theCase.value === "Oran Seddikia") theCase.value = "Seddikia";
    if (theCase.value === "Oran H.L.M. Seddikia") theCase.value = "Seddikia";
    if (theCase.value === "Oran Imam el Houari") theCase.value = "Sidi El Houari";
    if (theCase.value === "Oran Sidi el Bachir") theCase.value = "Sidi El Bachir";
    if (theCase.value === "BORJ EL KIFAN R1") theCase.value = "BORJ EL KIFAN";
    if (theCase.value === "Ghebala M cid Aicha") theCase.value = "Ghebala";
    if (theCase.value === "Ouled Askeur") theCase.value = "Boucif Ouled Askeur";
    if (theCase.value === "Tassadane") theCase.value = "Tassadane Haddada";
    if (theCase.value === "Oran Othmania") theCase.value = "Othmania";
    if (theCase.value === "EL MARSA RD") theCase.value = "EL MARSA";
    if (theCase.value === "Timezrit il Matten") theCase.value = "Timezrit";
    if (theCase.value === "Belhadef") theCase.value = "Bouraoui Belhadef";
    if (theCase.value === "Arres") theCase.value = "Amira Arres";
    if (theCase.value === "Adekar Kebouche") theCase.value = "Adekar";
    if (theCase.value === "Grarem") theCase.value = "Grarem Gouga";
    if (theCase.value === "MENEA") theCase.value = "MENEA OULED ATIA";
    if (theCase.value === "Rais Hamidou R2") theCase.value = "Rais Hamidou";
    if (theCase.value === "Annaba RP") theCase.value = "Annaba";
    if (theCase.value === "Tendla el Berd") theCase.value = "Tendla";
    if (theCase.value === "Chebaita") theCase.value = "Chebaita Mokhtar";
    if (theCase.value === "DERGANA R3") theCase.value = "DERGANA";

    applyDynamicCommuneRules(theCase);
});

charPress('control', true, (() => {
  let currentIndexConstantine = 0;
  let currentIndexOran = 0;
  return () => {
    let communes = document.getElementsByClassName('select2-chosen');
    let comval = communes[1]?.innerText || '';
    const theCase = document.querySelector('#address1');
    if (!theCase) return;
    if (comval === 'Constantine RP' || comval === 'Constantine Wilaya') {
      const stringList = ['Ali Mendjli', 'Boudraa Saleh', 'Cite 5 juillet', 'CITE ETTOUTE', 'SIDI RACHED'];
      theCase.value = stringList[currentIndexConstantine];
      currentIndexConstantine = (currentIndexConstantine + 1) % stringList.length;
    } else if (comval === 'Oran RP' || comval === 'Oran Wilaya') {
      const stringList = ['Bouamama', 'Ennour', 'El Emir'];
      theCase.value = stringList[currentIndexOran];
      currentIndexOran = (currentIndexOran + 1) % stringList.length;
    }
  };
})());

let checkDocInterval = setInterval(() => {
  let btn = document.getElementById('showDocumentBtnId');
  if (btn !== null) {
    clearInterval(checkDocInterval);
    if(typeof showInitialActivationDocument === 'function') showInitialActivationDocument();
  }
}, 200);

function pressEnterInPagerInput() {
  const boxy = document.getElementsByClassName("ui-pg-input");
  if (boxy.length === 0) return;
  const input = boxy[0];
  const event = new KeyboardEvent("keypress", {
    bubbles: true, cancelable: true, key: "Enter", code: "Enter", keyCode: 13, which: 13
  });
  input.dispatchEvent(event);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "-") { 
    e.preventDefault();
    pressEnterInPagerInput();
  }
});

document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === '*') {
        const btn = document.getElementById('rejectEditPrepaidID');
        if (btn) btn.click();
        setTimeout(() => {
            const select = document.getElementById('rejectReasonType');
            if (select) {
                select.value = "800015";
                select.dispatchEvent(new Event('change', { bubbles: true }));
            }
            setTimeout(() => {
                const rejectBtn = document.getElementById('rejectDiv');
                if (rejectBtn) rejectBtn.click();
            }, 100);
        }, 200);
    }
    if (e.ctrlKey && (e.key === 'm' || e.key === 'M')) {
        const select = document.getElementById('rejectReasonType');
        if (select) {
            select.value = "800016";
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
});