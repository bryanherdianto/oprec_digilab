import { cn } from "@/lib/utils";
import React, { useRef, useState, useCallback, useEffect } from "react"; // Added useEffect
import { motion } from "motion/react";
import { IconUpload, IconFile, IconPhoto, IconFileText } from "@tabler/icons-react";
import { useDropzone, FileRejection, Accept } from "react-dropzone";
import Image from "next/image";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
  acceptedFileTypes = { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
  outputFilename,
  maxSizeMB = 10,
  label = "Upload file",
  initialFileUrl,
  disabled = false
}: {
  onChange?: (file: File | null, desiredFilename?: string) => void;
  acceptedFileTypes?: Accept;
  outputFilename?: string;
  maxSizeMB?: number;
  label?: string;
  initialFileUrl?: string;
  disabled?: boolean;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialFile, setInitialFile] = useState<{ url: string, filename: string, type: string } | null>(null);

  // Handle initial file URL if provided
  useEffect(() => {
    if (initialFileUrl) {
      // Extract filename from URL
      const urlParts = initialFileUrl.split('/');
      const filename = urlParts[urlParts.length - 1];

      // Determine file type based on extension
      let type = 'application/octet-stream'; // Default type
      const extension = filename.split('.').pop()?.toLowerCase();
      if (extension) {
        if (['pdf'].includes(extension)) {
          type = 'application/pdf';
        } else if (['jpg', 'jpeg'].includes(extension)) {
          type = 'image/jpeg';
        } else if (['png'].includes(extension)) {
          type = 'image/png';
        }
      }

      setInitialFile({
        url: initialFileUrl,
        filename,
        type
      });
    } else {
      setInitialFile(null);
    }
  }, [initialFileUrl]);

  const validateFile = (file: File): boolean => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }
    setError(null);
    return true;
  };

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setError(null);

    if (fileRejections.length > 0) {
      const firstRejection = fileRejections[0];
      if (firstRejection.errors[0].code === 'file-too-large') {
        setError(`File is larger than ${maxSizeMB} MB`);
      } else if (firstRejection.errors[0].code === 'file-invalid-type') {
        setError(`Invalid file type. Accepted: ${Object.values(acceptedFileTypes).flat().join(', ')}`);
      } else {
        setError(firstRejection.errors[0].message);
      }
      setFile(null);
      setPreview(null);
      onChange?.(null);
      return;
    }

    if (acceptedFiles.length > 0) {
      const newFile = acceptedFiles[0];
      if (validateFile(newFile)) {
        setFile(newFile);

        if (newFile.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setPreview(e.target.result as string);
            }
          };
          reader.readAsDataURL(newFile);
        } else {
          setPreview(null);
        }

        onChange?.(newFile, outputFilename);
      } else {
        setFile(null);
        setPreview(null);
        onChange?.(null);
      }
    }

    // Clear initial file display when new file is uploaded
    setInitialFile(null);
  }, [onChange, maxSizeMB, acceptedFileTypes, outputFilename, validateFile]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop,
    accept: acceptedFileTypes,
    maxSize: maxSizeMB * 1024 * 1024,
  });

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <IconPhoto className="h-6 w-6 text-blue-500" />;
    } else if (fileType === 'application/pdf') {
      return <IconFileText className="h-6 w-6 text-red-500" />;
    } else {
      return <IconFile className="h-6 w-6 text-neutral-500" />;
    }
  };

  const acceptedTypesDescription = Object.entries(acceptedFileTypes)
    .map(([mimeType, extensions]) => {
      if (mimeType.startsWith('image/')) return `${extensions.join(', ')}`;
      if (mimeType === 'application/pdf') return `${extensions.join(', ')}`;
      return `${mimeType} (${extensions.join(', ')})`;
    })
    .join(', ');


  return (
    <div className="w-full">
      <div className="w-full" {...getRootProps()}>
        <motion.div
          onClick={handleClick}
          whileHover="animate"
          className={cn(
            "p-6 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden border border-dashed",
            error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
          )}
        >
          <input
            ref={fileInputRef}
            id={`file-upload-handle-${label.replace(/\s+/g, '-')}`}
            type="file"
            accept={Object.keys(acceptedFileTypes).join(',')}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onDrop([e.target.files[0]], []);
              }
            }}
            className="hidden"
            disabled={disabled}
          />
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
            <GridPattern />
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
              {label}
            </p>
            <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2 text-center">
              Drag and drop your file here or click to upload
            </p>
            <p className="relative z-20 font-sans text-sm text-neutral-500 dark:text-neutral-500 mt-1 text-center">
              Accepted: {acceptedTypesDescription}. Max: {maxSizeMB}MB
            </p>

            {error && (
              <p className="relative z-20 text-red-500 mt-2 text-sm">{error}</p>
            )}

            <div className="relative w-full mt-6 max-w-xl mx-auto">
              {!file && !initialFile && (
                <>
                  <motion.div
                    layoutId={`file-upload-placeholder-${label}`}
                    variants={mainVariant}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className={cn(
                      "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-2 w-full max-w-[8rem] mx-auto rounded-md",
                      "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                    )}
                  >
                    {isDragActive ? (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-neutral-600 flex flex-col items-center"
                      >
                        Drop here
                      </motion.p>
                    ) : (
                      <IconUpload className="h-6 w-6 text-neutral-600 dark:text-neutral-300" />
                    )}
                  </motion.div>

                  <motion.div
                    variants={secondaryVariant}
                    className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-2 w-full max-w-[8rem] mx-auto rounded-md"
                  ></motion.div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {(file || initialFile) && (
        <div className="mt-4 space-y-3">
          {file ? (
            <motion.div
              layoutId={`file-upload-display-${label}`}
              className="relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex items-start justify-between p-4 w-full mx-auto rounded-md shadow-sm border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {file.type.startsWith('image/') && preview ? (
                  <div className="relative h-12 w-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={preview}
                      alt={file.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 p-3 bg-gray-100 dark:bg-neutral-800 rounded">
                    {getFileIcon(file.type)}
                  </div>
                )}

                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">
                    {outputFilename ? `${outputFilename}.${file.name.split('.').pop()}` : file.name}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {file.type || 'Unknown type'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : initialFile && (
            <motion.div
              layoutId={`file-initial-${label}`}
              className="relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex items-start justify-between p-4 w-full mx-auto rounded-md shadow-sm border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {initialFile.type.startsWith('image/') ? (
                  <div className="relative h-12 w-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={initialFile.url}
                      alt={initialFile.filename}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 p-3 bg-gray-100 dark:bg-neutral-800 rounded">
                    {getFileIcon(initialFile.type)}
                  </div>
                )}

                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">
                    {initialFile.filename}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {initialFile.type}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${index % 2 === 0
                ? "bg-gray-50 dark:bg-neutral-950"
                : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
                }`}
            />
          );
        })
      )}
    </div>
  );
}