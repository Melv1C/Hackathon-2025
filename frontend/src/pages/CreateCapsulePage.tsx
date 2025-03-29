import { zodResolver } from '@hookform/resolvers/zod';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Chip,
    Container,
    FormControl,
    FormControlLabel,
    InputAdornment,
    Paper,
    Radio,
    RadioGroup,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '../components/ui/FileUpload';
import { useCapsules } from '../hooks/useCapsules';
import { CreateCapsuleSchema, CreateCapsuleType } from '../schemas/capsule';

export function CreateCapsulePage() {
    const navigate = useNavigate();
    const { useCreateCapsule } = useCapsules();
    const {
        mutate: createCapsule,
        isPending,
        isError,
        error,
        isSuccess,
    } = useCreateCapsule();
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [contentType, setContentType] = React.useState<'text' | 'file'>(
        'text'
    );

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm<CreateCapsuleType>({
        resolver: zodResolver(CreateCapsuleSchema),
        defaultValues: {
            title: '',
            description: '',
            content: {
                contentType: 'text',
                textContent: '',
            },
            unlockDate: '',
            isPrivate: false,
            recipients: [],
        },
    });

    // Watch the isPrivate value to conditionally render the recipients section
    const isPrivate = watch('isPrivate');
    const [recipientEmail, setRecipientEmail] = React.useState('');
    const [recipients, setRecipients] = React.useState<string[]>([]);

    // Handle success response
    React.useEffect(() => {
        if (isSuccess) {
            setOpenSnackbar(true);
            reset();
            setRecipients([]);
            setContentType('text');

            // Optional: Navigate to a success page or capsules list
            setTimeout(() => {
                navigate('/capsules');
            }, 2000);
        }
    }, [isSuccess, navigate, reset]);

    // Handle content type change
    const handleContentTypeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newType = event.target.value as 'text' | 'file';
        setContentType(newType);

        if (newType === 'text') {
            setValue('content', { contentType: 'text', textContent: '' });
        } else {
            setValue('content', {
                contentType: 'file',
                fileData: '',
                fileName: '',
                fileType: '',
            });
        }
    };

    // Handle file upload
    const handleFileSelect = (fileData: {
        fileData: string;
        fileName: string;
        fileType: string;
    }) => {
        setValue(
            'content',
            {
                contentType: 'file',
                ...fileData,
            },
            { shouldValidate: true }
        );
    };

    const addRecipient = () => {
        if (!recipientEmail.trim()) return;

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(recipientEmail)) return;

        setRecipients([...recipients, recipientEmail]);
        setRecipientEmail('');
    };

    const removeRecipient = (email: string) => {
        setRecipients(recipients.filter((r) => r !== email));
    };

    const onSubmit = (data: CreateCapsuleType) => {
        // Include the recipients in the form data
        const capsuleData = {
            ...data,
            recipients: isPrivate ? recipients : [],
        };

        // Call the mutation function
        createCapsule(capsuleData);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Create Time Capsule
                </Typography>

                {isError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        Error creating capsule:{' '}
                        {error instanceof Error
                            ? error.message
                            : 'Unknown error'}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ mt: 3 }}
                >
                    <Stack spacing={3}>
                        <TextField
                            id="title"
                            label="Title"
                            fullWidth
                            placeholder="Give your time capsule a name"
                            error={!!errors.title}
                            helperText={errors.title?.message}
                            {...register('title')}
                        />

                        <TextField
                            id="description"
                            label="Description (optional)"
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Describe what's in your time capsule"
                            {...register('description')}
                        />

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Content Type
                            </Typography>
                            <Controller
                                name="content.contentType"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        row
                                        {...field}
                                        onChange={handleContentTypeChange}
                                        value={contentType}
                                    >
                                        <FormControlLabel
                                            value="text"
                                            control={<Radio />}
                                            label="Text"
                                        />
                                        <FormControlLabel
                                            value="file"
                                            control={<Radio />}
                                            label="File"
                                        />
                                    </RadioGroup>
                                )}
                            />
                        </Box>

                        {contentType === 'text' ? (
                            <Controller
                                name="content.textContent"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        id="textContent"
                                        label="Text Content"
                                        fullWidth
                                        multiline
                                        rows={6}
                                        placeholder="What do you want to preserve for the future?"
                                        {...field}
                                    />
                                )}
                            />
                        ) : (
                            <Box>
                                <Typography variant="subtitle1" gutterBottom>
                                    Upload File
                                </Typography>
                                <FileUpload onFileSelect={handleFileSelect} />
                            </Box>
                        )}

                        <TextField
                            id="unlockDate"
                            label="Unlock Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                                min: new Date().toISOString().split('T')[0],
                            }}
                            error={!!errors.unlockDate}
                            helperText={errors.unlockDate?.message}
                            {...register('unlockDate')}
                        />

                        <FormControl>
                            <FormControlLabel
                                control={
                                    <Controller
                                        name="isPrivate"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                {...field}
                                                checked={field.value}
                                            />
                                        )}
                                    />
                                }
                                label="Make this capsule private (only accessible to specific recipients)"
                            />
                        </FormControl>

                        {isPrivate && (
                            <Box>
                                <Typography variant="subtitle1" gutterBottom>
                                    Recipients (optional)
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="email"
                                    label="Email Address"
                                    value={recipientEmail}
                                    onChange={(e) =>
                                        setRecipientEmail(e.target.value)
                                    }
                                    placeholder="Enter email address"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={addRecipient}
                                                    startIcon={<AddIcon />}
                                                >
                                                    Add
                                                </Button>
                                            </InputAdornment>
                                        ),
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addRecipient();
                                        }
                                    }}
                                />

                                {recipients.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{ mb: 1 }}
                                        >
                                            Recipients:
                                        </Typography>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            flexWrap="wrap"
                                            useFlexGap
                                        >
                                            {recipients.map((email) => (
                                                <Chip
                                                    key={email}
                                                    label={email}
                                                    onDelete={() =>
                                                        removeRecipient(email)
                                                    }
                                                    deleteIcon={<CloseIcon />}
                                                    sx={{ mb: 1 }}
                                                />
                                            ))}
                                        </Stack>
                                    </Box>
                                )}
                            </Box>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={isPending}
                            fullWidth
                        >
                            {isPending ? 'Creating...' : 'Create Time Capsule'}
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    Time capsule created successfully!
                </Alert>
            </Snackbar>
        </Container>
    );
}
