import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LockClockIcon from '@mui/icons-material/LockClock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Paper,
    Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useCapsules } from '../hooks/useCapsules';

export function CapsulePage() {
    const { capsuleId } = useParams<{ capsuleId: string }>();
    const { useCapsule } = useCapsules();
    const { data: capsule, isLoading, isError, error } = useCapsule(capsuleId);

    console.log('Capsule data:', capsule);

    // Helper function to download file content
    const downloadFile = () => {
        if (!capsule || capsule.content.contentType !== 'file') return;

        const { fileData, fileName, fileType } = capsule.content;
        const blob = new Blob([Buffer.from(fileData, 'base64')], {
            type: fileType,
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Format date in a user-friendly way
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Error loading capsule: {error?.message || 'Unknown error'}
            </Alert>
        );
    }

    if (!capsule) {
        return (
            <Alert severity="warning" sx={{ m: 2 }}>
                Capsule not found
            </Alert>
        );
    }

    const creationDate = formatDate(capsule.creationDate);
    const unlockDate = formatDate(capsule.unlockDate);
    const isUnlocked = capsule.isUnlocked;

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                {/* Header with status */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                    }}
                >
                    <Typography variant="h4" component="h1">
                        {capsule.title}
                    </Typography>
                    <Chip
                        icon={isUnlocked ? <LockOpenIcon /> : <LockClockIcon />}
                        label={isUnlocked ? 'Unlocked' : 'Locked'}
                        color={isUnlocked ? 'success' : 'primary'}
                    />
                </Box>

                {/* Dates information */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <Chip
                        icon={<CalendarTodayIcon />}
                        label={`Created on: ${creationDate}`}
                        variant="outlined"
                    />
                    <Chip
                        icon={isUnlocked ? <LockOpenIcon /> : <LockClockIcon />}
                        label={
                            isUnlocked
                                ? `Unlocked on: ${unlockDate}`
                                : `Unlocks on: ${unlockDate}`
                        }
                        variant="outlined"
                        color={isUnlocked ? 'success' : 'primary'}
                    />
                </Box>

                {/* Description if available */}
                {capsule.description && (
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ whiteSpace: 'pre-wrap' }}
                        >
                            {capsule.description}
                        </Typography>
                    </Box>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Capsule content section */}
                <Typography variant="h6" component="h2" gutterBottom>
                    Capsule Content
                </Typography>

                {!isUnlocked ? (
                    <Card sx={{ bgcolor: 'action.hover', mb: 2 }}>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <LockClockIcon
                                    color="primary"
                                    sx={{ fontSize: 40 }}
                                />
                                <Typography>
                                    This capsule is locked and will be available
                                    on {unlockDate}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ) : (
                    <Box sx={{ mt: 2 }}>
                        {capsule.content.contentType === 'text' ? (
                            <Paper
                                variant="outlined"
                                sx={{ p: 3, bgcolor: 'background.paper' }}
                            >
                                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                    {capsule.content.textContent}
                                </Typography>
                            </Paper>
                        ) : capsule.content.contentType === 'file' ? (
                            <Card sx={{ mb: 2 }}>
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Typography>
                                            File: {capsule.content.fileName} (
                                            {capsule.content.fileType})
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<FileDownloadIcon />}
                                            onClick={downloadFile}
                                        >
                                            Download
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ) : (
                            <Alert severity="warning">
                                Unknown content type
                            </Alert>
                        )}
                    </Box>
                )}

                {/* Recipients section if applicable */}
                {capsule.recipients && capsule.recipients.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Recipients:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {capsule.recipients.map((email, index) => (
                                <Chip key={index} label={email} size="small" />
                            ))}
                        </Box>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
