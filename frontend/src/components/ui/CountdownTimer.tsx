import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Box, Paper, Typography } from '@mui/material';

type TimeUnitProps = {
    value: number;
    label: string;
};

function TimeUnit(props: TimeUnitProps) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 1,
                minWidth: 60,
                textAlign: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                borderRadius: 1,
            }}
        >
            <Typography variant="h5" fontWeight="bold">
                {props.value.toString().padStart(2, '0')}
            </Typography>
            <Typography variant="caption">{props.label}</Typography>
        </Paper>
    );
}

export function CountdownTimer(props: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    title?: string;
}) {
    return (
        <Box sx={{ mt: 2 }}>
            {props.title && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="subtitle2" fontWeight="medium">
                        {props.title}
                    </Typography>
                </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <TimeUnit value={props.days} label="DAYS" />
                <TimeUnit value={props.hours} label="HOURS" />
                <TimeUnit value={props.minutes} label="MINS" />
                <TimeUnit value={props.seconds} label="SECS" />
            </Box>
        </Box>
    );
}
