import LockClockIcon from '@mui/icons-material/LockClock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { 
    Box, 
    Card, 
    CardActionArea, 
    CardContent, 
    Chip, 
    Typography 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserCapsulesType } from '../../schemas/capsuleSchemas';

type CapsuleCardProps = {
    capsule: UserCapsulesType[0];
}

export function CapsuleCard(props: CapsuleCardProps) {
    const { capsule } = props;
    const navigate = useNavigate();
    
    const unlockDate = new Date(capsule.unlockDate);
    const isUnlocked = capsule.isUnlocked;
    
    // Calculate time remaining or time since unlock
    const today = new Date();
    const timeDiff = unlockDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    const handleClick = () => {
        navigate(`/capsule/${capsule.id}`);
    };
    
    return (
        <Card 
            elevation={3} 
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-5px)'
                }
            }}
        >
            <CardActionArea 
                onClick={handleClick}
                sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'stretch',
                    justifyContent: 'flex-start' 
                }}
            >
                <Box 
                    sx={{ 
                        bgcolor: isUnlocked ? 'success.main' : 'primary.main',
                        color: 'white',
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    {isUnlocked ? (
                        <LockOpenIcon />
                    ) : (
                        <LockClockIcon />
                    )}
                    <Typography variant="body2">
                        {isUnlocked 
                            ? 'Unlocked'
                            : `Unlocks on ${unlockDate.toLocaleDateString()}`}
                    </Typography>
                </Box>
                
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom noWrap>
                        {capsule.title}
                    </Typography>
                    
                    <Box mt={2}>
                        <Chip 
                            label={isUnlocked 
                                ? `Unlocked on ${unlockDate.toLocaleDateString()}` 
                                : `${Math.abs(daysRemaining)} days ${daysRemaining > 0 ? 'remaining' : 'ago'}`
                            }
                            color={isUnlocked ? "success" : "primary"}
                            size="small"
                            icon={isUnlocked ? <LockOpenIcon /> : <LockClockIcon />}
                        />
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

