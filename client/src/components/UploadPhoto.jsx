import { useRef, useState } from "react";

/**
 * Photo upload zone with a live preview once a file is selected.
 * Reports the selected File object back to the parent via onPhotoSelected.
 */
export default function UploadPhoto({ onPhotoSelected }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  function handleFile(file) {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      alert("Please choose a JPEG, PNG, or WEBP image.");
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
    onPhotoSelected(file);
  }

  function handleChange(e) {
    handleFile(e.target.files?.[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div className="field-group">
      <label className="field-label">Product photo</label>

      <div
        className="upload-zone"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Selected product" className="upload-preview" />
        ) : (
          <>
            <div className="upload-zone-icon">📷</div>
            <div style={{ fontWeight: 600 }}>Click to upload, or drag a photo here</div>
            <div className="field-hint">JPEG, PNG, or WEBP — up to 10MB</div>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleChange}
      />

      {previewUrl && (
        <button
          type="button"
          className="btn-secondary"
          style={{ marginTop: 10 }}
          onClick={() => inputRef.current?.click()}
        >
          Choose a different photo
        </button>
      )}
    </div>
  );
}
