document.addEventListener(
  "DOMContentLoaded",
  async function () {

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

    const journal =
      document.getElementById("journal");

    const loading =
      document.getElementById("loading");

    const leftDate =
      document.getElementById("leftDate");

    const leftTitle =
      document.getElementById("leftTitle");

    const leftContent =
      document.getElementById("leftContent");

    const rightDate =
      document.getElementById("rightDate");

    const rightTitle =
      document.getElementById("rightTitle");

    const rightContent =
      document.getElementById("rightContent");

    const leftPageNumber =
      document.getElementById("leftPageNumber");

    const rightPageNumber =
      document.getElementById("rightPageNumber");

    const pageTurn =
      document.getElementById("pageTurn");

    const prevBtn =
      document.getElementById("prevBtn");

    const nextBtn =
      document.getElementById("nextBtn");

    const pageIndicator =
      document.getElementById("pageIndicator");

    const newEntryBtn =
      document.getElementById("newEntryBtn");

    const searchInput =
      document.getElementById("searchInput");

    const clearSearchBtn =
      document.getElementById("clearSearchBtn");

    const searchStatus =
      document.getElementById("searchStatus");

    const editor =
      document.getElementById("editor");

    const cancelBtn =
      document.getElementById("cancelBtn");

    const saveBtn =
      document.getElementById("saveBtn");

    const deleteBtn =
      document.getElementById("deleteBtn");

    const entryDate =
      document.getElementById("entryDate");

    const entryTitle =
      document.getElementById("entryTitle");

    const entryContent =
      document.getElementById("entryContent");

    const editorStatus =
      document.getElementById("editorStatus");


    /* =========================
       STATE
       ========================= */

    let allEntries = [];

    let entries = [];

    let currentIndex = 0;

    let editingId = null;

    let isTurning = false;


    /* =========================
       HELPERS
       ========================= */

    function formatDate(value) {

      if (!value) {
        return "";
      }

      const date =
        new Date(value);

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return value;
      }

      return date.toLocaleDateString(
        undefined,
        {
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      );
    }


    function clearPage(
      date,
      title,
      content,
      pageNumber
    ) {

      date.textContent = "";
      title.textContent = "";
      content.textContent = "";
      pageNumber.textContent = "";

    }


    /* =========================
       RENDER
       ========================= */

    function renderJournal() {

      if (!entries.length) {

        clearPage(
          leftDate,
          leftTitle,
          leftContent,
          leftPageNumber
        );

        clearPage(
          rightDate,
          rightTitle,
          rightContent,
          rightPageNumber
        );

        loading.textContent =
          allEntries.length
            ? "No matching entries."
            : "Nothing written yet.";

        loading.classList.remove(
          "hidden"
        );

        updateControls();

        return;
      }


      loading.classList.add(
        "hidden"
      );


      const rightEntry =
        entries[currentIndex];

      const leftEntry =
        currentIndex > 0
          ? entries[currentIndex - 1]
          : null;


      /* LEFT PAGE */

      if (leftEntry) {

        leftDate.textContent =
          formatDate(
            leftEntry.entry_date
          );

        leftTitle.textContent =
          leftEntry.title || "";

        leftContent.textContent =
          leftEntry.content || "";

        leftPageNumber.textContent =
          currentIndex;

      } else {

        clearPage(
          leftDate,
          leftTitle,
          leftContent,
          leftPageNumber
        );

      }


      /* RIGHT PAGE */

      rightDate.textContent =
        formatDate(
          rightEntry.entry_date
        );

      rightTitle.textContent =
        rightEntry.title || "";

      rightContent.textContent =
        rightEntry.content || "";

      rightPageNumber.textContent =
        currentIndex + 1;


      updateControls();

    }


    /* =========================
       CONTROLS
       ========================= */

    function updateControls() {

      const total =
        entries.length;

      pageIndicator.textContent =
        total
          ? `${currentIndex + 1} / ${total}`
          : "0 / 0";

      prevBtn.disabled =
        currentIndex <= 0;

      nextBtn.disabled =
        currentIndex >= total - 1;


      if (
        searchInput.value.trim()
      ) {

        searchStatus.textContent =
          `${total} matching entr${total === 1 ? "y" : "ies"}`;

      } else {

        searchStatus.textContent = "";

      }

    }


    /* =========================
       PAGE SNAPSHOT
       ========================= */

    function makePageSnapshot(
      entry
    ) {

      if (!entry) {
        return "";
      }

      return `
        <div class="page-turn-inner">

          <div class="entry-date">
            ${escapeHtml(
              formatDate(
                entry.entry_date
              )
            )}
          </div>

          <h1 class="entry-title">
            ${escapeHtml(
              entry.title || ""
            )}
          </h1>

          <div class="entry-content">
            ${escapeHtml(
              entry.content || ""
            )}
          </div>

        </div>
      `;

    }


    /* =========================
       PAGE TURN
       ========================= */

    function turnPage(
      direction
    ) {

      if (isTurning) {
        return;
      }

      if (!entries.length) {
        return;
      }


      const nextIndex =
        direction === "next"
          ? currentIndex + 1
          : currentIndex - 1;


      if (
        nextIndex < 0 ||
        nextIndex >= entries.length
      ) {
        return;
      }


      isTurning = true;


      /*
        For NEXT:

        The current RIGHT page
        is the page physically
        turning toward the LEFT.

        For PREVIOUS:

        The current LEFT page
        is the page physically
        turning toward the RIGHT.
      */

      const turningEntry =
        direction === "next"
          ? entries[currentIndex]
          : entries[currentIndex - 1];


      pageTurn.innerHTML =
        makePageSnapshot(
          turningEntry
        );


      pageTurn.className =
        "page-turn " +
        (
          direction === "next"
            ? "turn-next"
            : "turn-prev"
        );


      /*
        Change the actual pages
        after the paper has moved
        halfway.
      */

      setTimeout(
        function () {

          currentIndex =
            nextIndex;

          renderJournal();

        },
        360
      );


      setTimeout(
        function () {

          pageTurn.className =
            "page-turn";

          pageTurn.innerHTML = "";

          isTurning = false;

        },
        740
      );

    }


    /* =========================
       BUTTONS
       ========================= */

    prevBtn.addEventListener(
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
       KEYBOARD
       ========================= */

    document.addEventListener(
      "keydown",
      function (event) {

        if (
          editor &&
          !editor.classList.contains(
            "hidden"
          )
        ) {
          return;
        }


        if (
          event.key === "ArrowRight"
        ) {

          turnPage("next");

        }


        if (
          event.key === "ArrowLeft"
        ) {

          turnPage("prev");

        }

      }
    );


    /* =========================
       PHONE SWIPE
       ========================= */

    let touchStartX = 0;

    let touchStartY = 0;


    journal.addEventListener(
      "touchstart",
      function (event) {

        const touch =
          event.changedTouches[0];

        touchStartX =
          touch.screenX;

        touchStartY =
          touch.screenY;

      },
      {
        passive: true
      }
    );


    journal.addEventListener(
      "touchend",
      function (event) {

        const touch =
          event.changedTouches[0];

        const differenceX =
          touchStartX -
          touch.screenX;

        const differenceY =
          touchStartY -
          touch.screenY;


        /*
          Ignore vertical scrolling.
        */

        if (
          Math.abs(differenceY) >
          Math.abs(differenceX)
        ) {
          return;
        }


        if (
          Math.abs(differenceX) < 50
        ) {
          return;
        }


        if (
          differenceX > 0
        ) {

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
       PC MOUSE DRAG
       ========================= */

    let mouseStartX = null;

    let mouseStartY = null;

    let mouseDown = false;


    journal.addEventListener(
      "mousedown",
      function (event) {

        if (
          event.button !== 0
        ) {
          return;
        }

        mouseDown = true;

        mouseStartX =
          event.clientX;

        mouseStartY =
          event.clientY;

      }
    );


    journal.addEventListener(
      "mouseup",
      function (event) {

        if (!mouseDown) {
          return;
        }

        mouseDown = false;


        const differenceX =
          mouseStartX -
          event.clientX;

        const differenceY =
          mouseStartY -
          event.clientY;


        mouseStartX = null;
        mouseStartY = null;


        if (
          Math.abs(differenceY) >
          Math.abs(differenceX)
        ) {
          return;
        }


        if (
          Math.abs(differenceX) < 70
        ) {
          return;
        }


        if (
          differenceX > 0
        ) {

          turnPage("next");

        } else {

          turnPage("prev");

        }

      }
    );


    journal.addEventListener(
      "mouseleave",
      function () {

        mouseDown = false;

      }
    );


    /* =========================
       SEARCH
       ========================= */

    function applySearch() {

      const query =
        searchInput.value
          .trim()
          .toLowerCase();


      if (!query) {

        entries =
          [...allEntries];

        currentIndex = 0;

        renderJournal();

        return;
      }


      entries =
        allEntries.filter(
          function (entry) {

            const searchable =
              [
                entry.entry_date,
                entry.title,
                entry.content
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


            return searchable.includes(
              query
            );

          }
        );


      currentIndex = 0;

      renderJournal();

    }


    searchInput.addEventListener(
      "input",
      applySearch
    );


    clearSearchBtn.addEventListener(
      "click",
      function () {

        searchInput.value = "";

        applySearch();

        searchInput.focus();

      }
    );


    /* =========================
       LOAD ENTRIES
       ========================= */

    async function loadEntries() {

      loading.textContent =
        "Opening the journal…";

      loading.classList.remove(
        "hidden"
      );


      try {

        const result =
          await Promise.race([

            supabase
              .from("journal_entries")
              .select("*")
              .order(
                "entry_date",
                {
                  ascending: true
                }
              )
              .order(
                "created_at",
                {
                  ascending: true
                }
              ),

            new Promise(
              function (_, reject) {

                setTimeout(
                  function () {

                    reject(
                      new Error(
                        "Supabase did not respond within 10 seconds."
                      )
                    );

                  },
                  10000
                );

              }
            )

          ]);


        if (result.error) {
          throw result.error;
        }


        allEntries =
          result.data || [];


        entries =
          [...allEntries];


        currentIndex = 0;


        renderJournal();

      } catch (error) {

        console.error(
          "Journal loading error:",
          error
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


      deleteBtn.classList.add(
        "hidden"
      );


      saveBtn.textContent =
        "Save Entry";


      editor.classList.remove(
        "hidden"
      );


      entryTitle.focus();

    }


    newEntryBtn.addEventListener(
      "click",
      openNewEntry
    );


    /* =========================
       CLOSE EDITOR
       ========================= */

    function closeEditor() {

      editor.classList.add(
        "hidden"
      );

      editingId = null;

    }


    cancelBtn.addEventListener(
      "click",
      closeEditor
    );


    /* =========================
       SAVE
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
          "Saving…";


        try {

          let result;


          if (editingId) {

            result =
              await supabase
                .from("journal_entries")
                .update({

                  entry_date:
                    date,

                  title:
                    title,

                  content:
                    content,

                  updated_at:
                    new Date()
                      .toISOString()

                })
                .eq(
                  "id",
                  editingId
                );

          } else {

            result =
              await supabase
                .from("journal_entries")
                .insert({

                  entry_date:
                    date,

                  title:
                    title,

                  content:
                    content

                });

          }


          if (result.error) {
            throw result.error;
          }


          editorStatus.textContent =
            "Saved.";


          await loadEntries();


          setTimeout(
            function () {

              closeEditor();

            },
            300
          );


        } catch (error) {

          editorStatus.textContent =
            "Could not save: " +
            (
              error?.message ||
              String(error)
            );

        } finally {

          saveBtn.disabled =
            false;

        }

      }
    );


    /* =========================
       EDIT CURRENT ENTRY
       ========================= */

    journal.addEventListener(
      "dblclick",
      function () {

        if (!entries.length) {
          return;
        }


        const entry =
          entries[currentIndex];


        editingId =
          entry.id;


        entryDate.value =
          entry.entry_date || "";


        entryTitle.value =
          entry.title || "";


        entryContent.value =
          entry.content || "";


        editorStatus.textContent =
          "";


        deleteBtn.classList.remove(
          "hidden"
        );


        saveBtn.textContent =
          "Save Changes";


        editor.classList.remove(
          "hidden"
        );

      }
    );


    /* =========================
       DELETE
       ========================= */

    deleteBtn.addEventListener(
      "click",
      async function () {

        if (!editingId) {
          return;
        }


        const confirmed =
          window.confirm(
            "Delete this journal entry permanently?"
          );


        if (!confirmed) {
          return;
        }


        deleteBtn.disabled = true;


        try {

          const result =
            await supabase
              .from("journal_entries")
              .delete()
              .eq(
                "id",
                editingId
              );


          if (result.error) {
            throw result.error;
          }


          closeEditor();

          await loadEntries();


        } catch (error) {

          editorStatus.textContent =
            "Could not delete: " +
            (
              error?.message ||
              String(error)
            );

        } finally {

          deleteBtn.disabled =
            false;

        }

      }
    );


    /* =========================
       ESCAPE HTML
       ========================= */

    function escapeHtml(value) {

      return String(
        value ?? ""
      )
        .replace(
          /&/g,
          "&amp;"
        )
        .replace(
          /</g,
          "&lt;"
        )
        .replace(
          />/g,
          "&gt;"
        )
        .replace(
          /"/g,
          "&quot;"
        )
        .replace(
          /'/g,
          "&#039;"
        );

    }


    /* =========================
       START
       ========================= */

    await loadEntries();

  }
);
