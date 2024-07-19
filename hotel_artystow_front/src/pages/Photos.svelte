<script>
    import { HotelArtystowApi } from "../lib/HotelArtystowApi";

    let confirmDisabled = true;
    let previewSrc = '';
    let files = [];
    async function uploadImage() {
        const api = new HotelArtystowApi();
        const res = await api.uploadPhoto(files);
    }

    /**
    * @param {Event} e 
    */
    function fileInputChange(e) {
        const [file] = this.files;
        files = this.files;

        previewSrc = window.URL.createObjectURL(file);

        if(file != null) {
            confirmDisabled = false;
        }
    }
</script>

<style>
    .photo-gallery {
        width: 90%;
        border-radius: 20px;
        min-height: 75vh;
    }

    @media only screen and (max-width: 500px) {
        .photo-gallery {
            border-radius: 0;
        }
    }

    .upload-wrap {
        background-color: cornflowerblue;
        border-radius: 6px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 3;
    }

    .upload-confirm-wrap {
        flex: 1;
        margin-left: 1em;
    }

    .upload-text {
        position: absolute;
        color: white;
    }

    .file-input {
        min-height: 50px;
        position: relative;
        z-index: 1;
        opacity: 0;
        height: 100%;
        cursor: pointer;
    }

    .spacer {
        margin-top: 20px;
        margin-bottom: 20px;
        color: white;
        width: 95%;
    }

    .gallery {
        display: grid;
    }

    .confirm-upload {
        height: 100%;
        margin-top: 0;
    }
    .confirm-upload:disabled {
        opacity: 0.7;
    }

    .photo-preview {
        flex: 1;
        padding: 5px;
        padding-bottom: 0;
        margin-top: 20px;
        border: 2px solid cornflowerblue;
    }

    .photo-prev-img {
        max-width: 100%;
    }
</style>
<div class="bg-primary card photo-gallery col">
    <div class="row">
        <div class="upload-wrap">
            <span class="upload-text">Wybierz zdjęcia</span>
            <input type="file" class="w-100 file-input" accept="image/*" on:change={fileInputChange}>
        </div>
        <div class="upload-confirm-wrap">
            <button type="button" disabled={confirmDisabled} on:click={uploadImage} class="w-100 btn confirm-upload">Wyślij</button>
        </div>
    </div>
    <div class="row">
        <div class="photo-preview">
            <img src="{previewSrc}" class="photo-prev-img" alt="Podgląd">
        </div>
    </div>
    <hr class="spacer">
    <div class="gallery">

    </div>
</div>
