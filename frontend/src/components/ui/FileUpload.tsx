import {
    Clear as ClearIcon,
    CloudUpload as CloudUploadIcon,
    InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    IconButton,
    LinearProgress,
    Paper,
    Typography,
} from '@mui/material';
import React, { useCallback, useState } from 'react';

interface FileUploadProps {
    onFileSelect: (fileData: {
        fileData: string;
        fileName: string;
        fileType: string;
    }) => void;
    maxSizeMB?: number;
    acceptedTypes?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
    onFileSelect,
    maxSizeMB = 10, // Default 10MB max size
    acceptedTypes = ['image/*', 'application/pdf', 'text/*'],
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const validateFile = (file: File): boolean => {
        setError(null);

        // Check file size
        if (file.size > maxSizeBytes) {
            setError(`File size exceeds the ${maxSizeMB}MB limit`);
            return false;
        }

        // Check file type
        const isValidType = acceptedTypes.some((type) => {
            if (type.includes('*')) {
                const category = type.split('/')[0];
                return file.type.startsWith(category);
            }
            return file.type === type;
        });

        if (!isValidType) {
            setError(
                `File type not allowed. Accepted types: ${acceptedTypes.join(
                    ', '
                )}`
            );
            return false;
        }

        return true;
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result as string;
                // Remove the data:image/jpeg;base64, prefix
                const base64Data = base64String.split(',')[1];
                resolve(base64Data);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFile = async (file: File) => {
        if (validateFile(file)) {
            setFile(file);
            setIsLoading(true);
            try {
                const base64Data = await convertToBase64(file);
                onFileSelect({
                    fileData: base64Data,
                    fileName: file.name,
                    fileType: file.type,
                });
                setIsLoading(false);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                setError('Error converting file to base64');
                setIsLoading(false);
            }
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
        },
        []
    );

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    const clearFile = () => {
        setFile(null);
        onFileSelect({
            fileData: '',
            fileName: '',
            fileType: '',
        });
    };

    return (
        <Box sx={{ width: '100%' }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!file ? (
                <Paper
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    sx={{
                        border: isDragging
                            ? '2px dashed #3f51b5'
                            : '2px dashed #ccc',
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: isDragging
                            ? 'rgba(63, 81, 181, 0.1)'
                            : 'transparent',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileInput}
                        style={{ display: 'none' }}
                        accept={acceptedTypes.join(',')}
                    />
                    <CloudUploadIcon
                        sx={{ fontSize: 48, color: 'primary.main', mb: 1 }}
                    />
                    <Typography variant="h6" gutterBottom>
                        Drag and drop file here
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mb: 2 }}
                    >
                        or
                    </Typography>
                    <Button
                        variant="contained"
                        component="label"
                        htmlFor="file-upload"
                    >
                        Browse Files
                    </Button>
                    <Typography
                        variant="caption"
                        display="block"
                        sx={{ mt: 2, color: 'text.secondary' }}
                    >
                        Maximum size: {maxSizeMB}MB
                    </Typography>
                    <Typography
                        variant="caption"
                        display="block"
                        sx={{ color: 'text.secondary' }}
                    >
                        Accepted types: {acceptedTypes.join(', ')}
                    </Typography>
                </Paper>
            ) : (
                <Paper sx={{ p: 2, position: 'relative' }}>
                    {isLoading && (
                        <LinearProgress
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                            }}
                        />
                    )}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FileIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Box>
                                <Typography variant="body1">
                                    {file.name}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="textSecondary"
                                >
                                    {(file.size / 1024).toFixed(1)} KB
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton onClick={clearFile} size="small">
                            <ClearIcon />
                        </IconButton>
                    </Box>
                </Paper>
            )}
        </Box>
    );
};
