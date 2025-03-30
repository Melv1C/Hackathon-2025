import { Paper, PaperProps } from '@mui/material';
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownViewerProps extends PaperProps {
    markdown: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
    markdown,
    sx,
    ...paperProps
}) => {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 3,
                bgcolor: 'background.paper',
                '& img': { maxWidth: '100%' },
                '& pre': {
                    overflowX: 'auto',
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    padding: 1,
                    borderRadius: 1,
                },
                '& code': {
                    fontFamily: 'monospace',
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    padding: '2px 4px',
                    borderRadius: 1,
                },
                '& a': {
                    color: 'primary.main',
                },
                ...sx,
            }}
            {...paperProps}
        >
            <ReactMarkdown>{markdown}</ReactMarkdown>
        </Paper>
    );
};
