import LockClockIcon from '@mui/icons-material/LockClock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserCapsulesType } from '../../schemas/capsuleSchemas';

type CapsuleCardProps = {
    capsule: UserCapsulesType[0];
};

export function CapsuleCard(props: CapsuleCardProps) {
    const { capsule } = props;
    const navigate = useNavigate();

    const unlockDate = new Date(capsule.unlockDate);
    const isUnlocked = capsule.isUnlocked;

    // Format date and time
    const formattedDateTime = unlockDate.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const handleClick = () => {
        navigate(`/capsule/${capsule.id}`);
    };

    // Common card content
    const cardContent = (
        <>
            <Box
                sx={{
                    bgcolor: isUnlocked ? 'success.main' : 'primary.main',
                    color: 'white',
                    p: 2.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                }}
            >
                {isUnlocked ? (
                    <LockOpenIcon fontSize="medium" />
                ) : (
                    <LockClockIcon fontSize="medium" />
                )}
                <Typography variant="body1" fontWeight="medium">
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                </Typography>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    noWrap
                    sx={{
                        fontWeight: 600,
                        mb: 2,
                    }}
                >
                    {capsule.title}
                </Typography>

                <Box
                    mt={2.5}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                    }}
                >
                    <Chip
                        label={
                            isUnlocked
                                ? `Unlocked on ${formattedDateTime}`
                                : `Unlocks on ${formattedDateTime}`
                        }
                        color={isUnlocked ? 'success' : 'primary'}
                        size="medium"
                        icon={isUnlocked ? <LockOpenIcon /> : <LockClockIcon />}
                        sx={{
                            px: 1,
                            py: 0.75,
                            '& .MuiChip-label': {
                                px: 1,
                                fontWeight: 500,
                            },
                            '& .MuiChip-icon': {
                                ml: 0.5,
                            },
                        }}
                    />
                </Box>
            </CardContent>
        </>
    );

    return (
        <Card
            elevation={4}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                },
                overflow: 'hidden',
                border: `1px solid ${
                    isUnlocked
                        ? 'rgba(76, 175, 80, 0.3)'
                        : 'rgba(25, 118, 210, 0.3)'
                }`,
                cursor: 'pointer',
            }}
            onClick={handleClick}
        >
            <CardActionArea
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    justifyContent: 'flex-start',
                }}
            >
                {cardContent}
            </CardActionArea>
        </Card>
    );
}
