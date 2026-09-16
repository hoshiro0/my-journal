document.addEventListener("DOMContentLoaded", async function () {

  /* =========================
     SUPABASE
     ========================= */

  const SUPABASE_URL =
    "https://ryydohuebadsgpjnpsch.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_9moh5wpLBUPrkNJOBpWu_g_IlLJ6d2V";

  const supabase =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );


  /* =========================
     ELEMENTS
     ========================= */

  const loading =
    document.getElementById("loading");


  const leftDate =
    document.getElementById("leftDate");

  const leftTitle =
    document.getElementById("leftTitle");

  const leftText =
    document.getElementById("leftText");

  const leftNumber =
    document.getElementById("leftNumber");


  const rightDate =
    document.getElementById("rightDate");

  const rightTitle =
    document.getElementById("rightTitle");

  const rightText =
    document.getElementById("rightText");

  const rightNumber =
    document.getElementById("rightNumber");


  const previousBtn =
    document.getElementById("previousBtn");


  const nextBtn =
    document.getElementById("nextBtn");


  const pageIndicator =
    document.getElementById("pageIndicator");


  const newEntryBtn =
    document.getElementById("newEntryBtn");


  const searchBtn =
    document.getElementById("searchBtn");


  const editorModal =
    document.getElementById("editorModal");


  const searchModal =
    document.getElementById("searchModal");


  const closeEditorBtn =
    document.getElementById("closeEditorBtn");


  const closeSearchBtn =
    document.getElementById("closeSearchBtn");


  const cancelBtn =
    document.getElementById("cancelBtn");


  const saveBtn =
    document.getElementById("saveBtn");


  const entryDate =
    document.getElementById("entryDate");


  const entryTitle =
    document.getElementById("entryTitle");


  const entryContent =
    document.getElementById("entryContent");


  const editorStatus =
    document.getElementById("editorStatus");


  const searchInput =
    document.getElementById("searchInput");


  const searchResults =
    document.getElementById("searchResults");


  const journal =
    document.getElementById("journal");


  /* =========================
     STATE
     ========================= */

  let entries = [];

  let currentIndex = 0;

  let editingId = null;


  /* =========================
     DATE
     ========================= */

  function formatDate(dateString) {

    if (!dateString) {
      return "";
    }

    const date =
      new Date(
        dateString + "T00:00:00"
      );

    return date.toLocaleDateString(
      undefined,
      {
        month: "long",
        day: "numeric",
        year: "numeric"
      }
    );
  }


  /* =========================
     ESCAPE HTML
     ========================= */

  function escapeHtml(value) {

    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  /* =========================
     DISPLAY
     ========================= */

  function renderJournal() {

    const mobile =
      window.innerWidth <= 700;


    if (!entries.length) {

      leftDate.textContent = "";

      leftTitle.textContent = "";

      leftText.innerHTML =
        '<div class="page-empty">Nothing written yet.</div>';

      leftNumber.textContent = "";


      rightDate.textContent = "";

      rightTitle.textContent = "";

      rightText.innerHTML = "";

      rightNumber.textContent = "";


      pageIndicator.textContent =
        "0 / 0";


      previousBtn.disabled = true;

      nextBtn.disabled = true;

      return;
    }


    if (mobile) {

      const entry =
        entries[currentIndex];


      leftDate.textContent = "";

      leftTitle.textContent = "";

      leftText.innerHTML = "";


      rightDate.textContent =
        formatDate(entry.entry_date);


      rightTitle.textContent =
        entry.title || "";


      rightText.textContent =
        entry.content || "";


      rightNumber.textContent =
        String(currentIndex + 1)
          .padStart(2, "0");


      pageIndicator.textContent =
        `${currentIndex + 1} / ${entries.length}`;


    } else {

      const left =
        entries[currentIndex * 2];


      const right =
        entries[currentIndex * 2 + 1];


      renderPage(
        left,
        leftDate,
        leftTitle,
        leftText,
        leftNumber,
        currentIndex * 2 + 1
      );


      renderPage(
        right,
        rightDate,
        rightTitle,
        rightText,
        rightNumber,
        currentIndex * 2 + 2
      );


      const totalSpreads =
        Math.max(
          1,
          Math.ceil(entries.length / 2)
        );


      pageIndicator.textContent =
        `${currentIndex + 1} / ${totalSpreads}`;
    }


    previousBtn.disabled =
      currentIndex <= 0;


    const maxIndex =
      mobile
        ? entries.length - 1
        : Math.max(
            0,
            Math.ceil(entries.length / 2) - 1
          );


    nextBtn.disabled =
      currentIndex >= maxIndex;
  }


  function renderPage(
    entry,
    dateElement,
    titleElement,
    textElement,
    numberElement,
    pageNumber
  ) {

    if (!entry) {

      dateElement.textContent = "";

      titleElement.textContent = "";

      textElement.innerHTML =
        '<div class="page-empty">✦</div>';

      numberElement.textContent =
        String(pageNumber)
          .padStart(2, "0");

      return;
    }


    dateElement.textContent =
      formatDate(entry.entry_date);


    titleElement.textContent =
      entry.title || "";


    textElement.textContent =
      entry.content || "";


    numberElement.textContent =
      String(pageNumber)
        .padStart(2, "0");
  }


  /* =========================
     PAGE TURN
     ========================= */

  function turnPage(direction) {

    const maxIndex =
      window.innerWidth <= 700
        ? entries.length - 1
        : Math.max(
            0,
            Math.ceil(entries.length / 2) - 1
          );


    if (direction === "next") {

      if (currentIndex >= maxIndex) {
        return;
      }

      journal.classList.remove("turn-prev");

      void journal.offsetWidth;

      journal.classList.add("turn-next");

      currentIndex++;

      setTimeout(
        renderJournal,
        90
      );

    } else {

      if (currentIndex <= 0) {
        return;
      }

      journal.classList.remove("turn-next");

      void journal.offsetWidth;

      journal.classList.add("turn-prev");

      currentIndex--;

      setTimeout(
        renderJournal,
        90
      );
    }


    setTimeout(
      function () {

        journal.classList.remove(
          "turn-next",
          "turn-prev"
        );

      },
      500
    );
  }


  previousBtn.addEventListener(
    "click",
    function () {
      turnPage("prev");
    }
  );


  nextBtn.addEventListener(
    "click",
    function () {
      turnPage("next");
    }
  );


  /* =========================
     SWIPE
     ========================= */

  let touchStartX = 0;

  let touchEndX = 0;


  journal.addEventListener(
    "touchstart",
    function (event) {

      touchStartX =
        event.changedTouches[0].screenX;

    },
    {
      passive: true
    }
  );


  journal.addEventListener(
    "touchend",
    function (event) {

      touchEndX =
        event.changedTouches[0].screenX;


      const distance =
        touchStartX - touchEndX;


      if (Math.abs(distance) < 45) {
        return;
      }


      if (distance > 0) {

        turnPage("next");

      } else {

        turnPage("prev");

      }

    },
    {
      passive: true
    }
  );


  /* =========================
     NEW ENTRY
     ========================= */

  function openNewEntry() {

    editingId = null;

    entryDate.value =
      new Date()
        .toISOString()
        .split("T")[0];


    entryTitle.value = "";

    entryContent.value = "";

    editorStatus.textContent = "";

    saveBtn.textContent =
      "Save Entry";


    editorModal.classList.remove(
      "hidden"
    );


    setTimeout(
      function () {
        entryContent.focus();
      },
      100
    );
  }


  newEntryBtn.addEventListener(
    "click",
    openNewEntry
  );


  function closeEditor() {

    editorModal.classList.add(
      "hidden"
    );
  }


  closeEditorBtn.addEventListener(
    "click",
    closeEditor
  );


  cancelBtn.addEventListener(
    "click",
    closeEditor
  );


  /* =========================
     SAVE ENTRY
     ========================= */

  saveBtn.addEventListener(
    "click",
    async function () {

      const date =
        entryDate.value;


      const title =
        entryTitle.value.trim();


      const content =
        entryContent.value.trim();


      if (!date) {

        editorStatus.textContent =
          "Please choose a date.";

        return;
      }


      if (!content) {

        editorStatus.textContent =
          "Write something first.";

        return;
      }


      saveBtn.disabled = true;

      editorStatus.textContent =
        "Saving...";


      let result;


      if (editingId) {

        result =
          await supabase
            .from("journal_entries")
            .update({
              entry_date: date,
              title: title,
              content: content,
              updated_at:
                new Date().toISOString()
            })
            .eq("id", editingId);

      } else {

        result =
          await supabase
            .from("journal_entries")
            .insert({
              entry_date: date,
              title: title,
              content: content
            });
      }


      saveBtn.disabled = false;


      if (result.error) {

        editorStatus.textContent =
          "Could not save: " +
          result.error.message;

        return;
      }


      editorStatus.textContent =
        "Saved.";


      await loadEntries();


      setTimeout(
        closeEditor,
        400
      );
    }
  );


  /* =========================
     SEARCH
     ========================= */

  searchBtn.addEventListener(
    "click",
    function () {

      searchModal.classList.remove(
        "hidden"
      );

      searchInput.value = "";

      searchResults.innerHTML = "";

      setTimeout(
        function () {
          searchInput.focus();
        },
        100
      );
    }
  );


  closeSearchBtn.addEventListener(
    "click",
    function () {

      searchModal.classList.add(
        "hidden"
      );

    }
  );


  searchInput.addEventListener(
    "input",
    function () {

      const query =
        searchInput.value
          .trim()
          .toLowerCase();


      if (!query) {

        searchResults.innerHTML = "";

        return;
      }


      const matches =
        entries.filter(
          function (entry) {

            return (
              (entry.title || "")
                .toLowerCase()
                .includes(query)

              ||

              (entry.content || "")
                .toLowerCase()
                .includes(query)

              ||

              (entry.entry_date || "")
                .includes(query)
            );
          }
        );


      if (!matches.length) {

        searchResults.innerHTML =
          "<p>No entries found.</p>";

        return;
      }


      searchResults.innerHTML = "";


      matches.forEach(
        function (entry) {

          const button =
            document.createElement(
              "button"
            );


          button.type = "button";

          button.className =
            "search-result";


          const preview =
            (entry.content || "")
              .slice(0, 120);


          button.innerHTML = `

            <div class="search-result-title">
              ${escapeHtml(
                entry.title ||
                "Untitled entry"
              )}
            </div>

            <div class="search-result-date">
              ${escapeHtml(
                formatDate(
                  entry.entry_date
                )
              )}
            </div>

            <div class="search-result-preview">
              ${escapeHtml(
                preview
              )}${preview.length >= 120 ? "..." : ""}
            </div>

          `;


          button.addEventListener(
            "click",
            function () {

              const index =
                entries.findIndex(
                  function (item) {
                    return item.id === entry.id;
                  }
                );


              if (index !== -1) {

                if (
                  window.innerWidth <= 700
                ) {

                  currentIndex =
                    index;

                } else {

                  currentIndex =
                    Math.floor(
                      index / 2
                    );
                }


                renderJournal();

                searchModal.classList.add(
                  "hidden"
                );
              }

            }
          );


          searchResults.appendChild(
            button
          );

        }
      );
    }
  );


  /* =========================
     LOAD ENTRIES
     ========================= */

    async function loadEntries() {

    loading.classList.remove("hidden");
    loading.textContent = "Opening the journal…";

    try {

      if (!supabase) {
        throw new Error("Supabase client is not available.");
      }

      const query = supabase
        .from("journal_entries")
        .select("*")
        .order(
  "created_at",
  {
    ascending: true
  }
)

      const timeout = new Promise((_, reject) => {
        setTimeout(
          () => {
            reject(
              new Error(
                "Supabase did not respond within 10 seconds."
              )
            );
          },
          10000
        );
      });

      const {
        data,
        error
      } = await Promise.race([
        query,
        timeout
      ]);

      if (error) {
        throw error;
      }

      entries =
        data || [];

      currentIndex = 0;

      renderJournal();

      loading.classList.add(
        "hidden"
      );

    } catch (error) {

      console.error(
        "Journal loading error:",
        error
      );

      loading.classList.remove(
        "hidden"
      );

      loading.textContent =
        "Could not open the journal: " +
        (
          error?.message ||
          String(error)
        );

    }

  }

  /* =========================
     WINDOW RESIZE
     ========================= */

  let previousMobile =
    window.innerWidth <= 700;


  window.addEventListener(
    "resize",
    function () {

      const nowMobile =
        window.innerWidth <= 700;


      if (
        nowMobile !== previousMobile
      ) {

        currentIndex = 0;

        previousMobile =
          nowMobile;

        renderJournal();
      }

    }
  );


  /* =========================
     START
     ========================= */

  await loadEntries();

});
