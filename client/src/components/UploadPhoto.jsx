import { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { ImagePlus, Check, X, RefreshCw } from "lucide-react";

const UploadPhoto = forwardRef(function UploadPhoto(
  { onPhotoSelected },
  ref
) {
  const inputRef = useRef(null);

  const [photos, setPhotos] = useState([]);
  const [primaryId, setPrimaryId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const allowed = ["image/jpeg", "image/png", "image/webp"];

  function addFiles(fileList) {
    const validFiles = Array.from(fileList).filter((file) =>
      allowed.includes(file.type)
    );

    if (validFiles.length === 0) {
      alert("Please choose JPEG, PNG, or WEBP images.");
      return;
    }

    const newPhotos = validFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      id: `${file.name}-${Date.now()}-${Math.random()}`,
    }));

    // Add photos only.
    setPhotos((prev) => [...prev, ...newPhotos]);

    // If there is no primary photo yet,
    // select the first newly added photo OUTSIDE setPhotos().
    if (!primaryId && newPhotos.length > 0) {
      const firstPhoto = newPhotos[0];

      setPrimaryId(firstPhoto.id);
      onPhotoSelected(firstPhoto.file);
    }
  }

  function selectPrimary(photo) {
    setPrimaryId(photo.id);
    onPhotoSelected(photo.file);
  }

  function removePhoto(photo) {
  const remaining = photos.filter((p) => p.id !== photo.id);

  setPhotos(remaining);

  if (photo.id === primaryId) {
    const nextPrimary = remaining[0] || null;

    setPrimaryId(nextPrimary?.id ?? null);
    onPhotoSelected(nextPrimary?.file ?? null);
  }
}

  useImperativeHandle(ref, () => ({
    injectFile(file) {
      addFiles([file]);
    },
  }));

  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">
        Product photos
      </label>

      {photos.length === 0 ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200
            ${
              isDragging
                ? "border-indigo-400 bg-indigo-500/5 scale-[1.01]"
                : "border-zinc-700 hover:border-indigo-500/60 hover:bg-zinc-800/40"
            }`}
        >
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center mb-3">
              <ImagePlus size={22} className="text-indigo-400" />
            </div>

            <div className="font-semibold text-zinc-200">
              Drop a photo, or click to browse
            </div>

            <div className="text-xs text-zinc-500 mt-1">
              JPEG, PNG, or WEBP — add multiple angles, up to 10MB each
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-2.5">
            {photos.map((photo) => {
              const isPrimary = photo.id === primaryId;

              return (
                <div
                  key={photo.id}
                  onClick={() => selectPrimary(photo)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all aspect-square
                    ${
                      isPrimary
                        ? "border-indigo-400 ring-2 ring-indigo-400/30"
                        : "border-zinc-800 hover:border-zinc-600"
                    }`}
                >
                  <img
                    src={photo.previewUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />

                  {isPrimary && (
                    <div className="absolute top-1.5 left-1.5 bg-indigo-500 text-white rounded-full p-1">
                      <Check size={11} />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(photo);
                    }}
                    className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                  >
                    <X size={11} />
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-zinc-700 hover:border-indigo-500/60 flex items-center justify-center text-zinc-500 hover:text-indigo-400 transition-colors"
            >
              <ImagePlus size={18} />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-2">
            <RefreshCw size={11} />
            Tap a photo to set it as primary — the indigo outline marks the
            active one.
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />
    </div>
  );
});

export default UploadPhoto;