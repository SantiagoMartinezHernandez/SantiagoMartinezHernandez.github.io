---
layout: page
title: Barrow Neurological Institute
description: Summer Internship research 2023
img: assets/img/ATE.jpg
importance: 3
category: fun
---
<!-- Import the component -->
<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
<script nomodule src="https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js"></script>
<!-- Use it like any other HTML element -->
<model-viewer src="smalltest.gltf" ar ar-modes="webxr scene-viewer quick-look" camera-controls poster="assets/img/oops.jpg" shadow-intensity="1" camera-orbit="-180.8deg 22.5deg 18.59m" field-of-view="30deg">
    <div class="progress-bar hide" slot="progress-bar">
        <div class="update-bar"></div>
    </div>
    <button slot="ar-button" id="ar-button">
        View in your space
    </button>
    <div id="ar-prompt">
        <img src="https://modelviewer.dev/shared-assets/icons/hand.png">
    </div>
</model-viewer>
