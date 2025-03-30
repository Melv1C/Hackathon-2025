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
import { CountdownTimer } from '../components/ui/CountdownTimer';
import { useCapsules } from '../hooks/useCapsules';
import { useCountdown } from '../hooks/useCountdown';

export function CapsulePage() {
    const { capsuleId } = useParams<{ capsuleId: string }>();
    const { useCapsule } = useCapsules();
    const {
        data: capsule,
        isLoading,
        isError,
        error,
        refetch,
    } = useCapsule(capsuleId);

    // Calculate countdown timer if capsule exists and is locked
    const unlockDate =
        capsule && !capsule.isUnlocked ? new Date(capsule.unlockDate) : null;
    const countdown = useCountdown(unlockDate);

    // Handle countdown completion
    const handleCountdownComplete = () => {
        console.log('Capsule countdown completed - refreshing capsule data');
        refetch();
    };

    console.log('Capsule data:', capsule);

    // Helper function to download file content
    const downloadFile = () => {
        if (
            !capsule ||
            !capsule.content ||
            capsule.content.contentType !== 'file'
        )
            return;

        const { fileData, fileName, fileType } = capsule.content;

        // Convert base64 to binary using browser APIs
        const binaryString = atob(fileData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], {
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
    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(date).toLocaleDateString('en-US', options);
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
    const unlockDateFormatted = formatDate(capsule.unlockDate);
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
                                ? `Unlocked on: ${unlockDateFormatted}`
                                : `Unlocks on: ${unlockDateFormatted}`
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

                {/* Warning for potentially altered content */}
                {capsule.altered && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        This capsule's content may have been altered since creation.
                    </Alert>
                )}

                {!isUnlocked ? (
                    <Card
                        sx={{
                            bgcolor: 'action.hover',
                            mb: 2,
                            background:
                                'linear-gradient(135deg, #8e2de2, #4a00e0)',
                            color: 'white',
                        }}
                    >
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    flexDirection: 'column',
                                }}
                            >
                                {/* Add countdown timer for locked capsules */}
                                {countdown && (
                                    <CountdownTimer
                                        years={countdown.years}
                                        days={countdown.days}
                                        hours={countdown.hours}
                                        minutes={countdown.minutes}
                                        seconds={countdown.seconds}
                                        title="Time remaining until unlock:"
                                        onComplete={handleCountdownComplete}
                                    />
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                ) : (
                    <Box sx={{ mt: 2 }}>
                        {capsule.content!.contentType === 'text' ? (
                            <Paper
                                variant="outlined"
                                sx={{ p: 3, bgcolor: 'background.paper' }}
                            >
                                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                    {capsule.content!.textContent}
                                </Typography>
                            </Paper>
                        ) : capsule.content!.contentType === 'file' ? (
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
                                            File: {capsule.content!.fileName} (
                                            {capsule.content!.fileType})
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
