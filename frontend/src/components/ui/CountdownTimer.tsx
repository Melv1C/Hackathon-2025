import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Box, Paper, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

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
    years?: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    title?: string;
    onComplete?: () => void;
}) {
    // Ref to track if onComplete has been called
    const hasCompletedRef = useRef(false);

    useEffect(() => {
        // Check if countdown has reached zero and onComplete callback exists
        if (
            props.onComplete &&
            (!props.years || props.years === 0) &&
            props.days === 0 &&
            props.hours === 0 &&
            props.minutes === 0 &&
            props.seconds === 0 &&
            !hasCompletedRef.current
        ) {
            // Set ref to prevent multiple calls
            hasCompletedRef.current = true;

            // Call the callback
            props.onComplete();
        }

        // Reset the ref if countdown has values again (in case it gets reused)
        if (
            (props.years && props.years > 0) ||
            props.days > 0 ||
            props.hours > 0 ||
            props.minutes > 0 ||
            (props.seconds > 0 && hasCompletedRef.current)
        ) {
            hasCompletedRef.current = false;
        }
    }, [props]);

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
                {props.years !== undefined && (
                    <TimeUnit value={props.years} label="YEARS" />
                )}
                <TimeUnit value={props.days} label="DAYS" />
                <TimeUnit value={props.hours} label="HOURS" />
                <TimeUnit value={props.minutes} label="MINS" />
                <TimeUnit value={props.seconds} label="SECS" />
            </Box>
        </Box>
    );
}
