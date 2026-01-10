import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ImageUploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onInsert: (url: string, alt: string) => void;
}

export default function ImageUploadDialog({ open, onOpenChange, onInsert }: ImageUploadDialogProps) {
    const [imageUrl, setImageUrl] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInsertUrl = () => {
        if (imageUrl) {
            onInsert(imageUrl, imageAlt);
            resetForm();
            onOpenChange(false);
        }
    };

    const handleInsertUpload = () => {
        if (previewUrl) {
            // For now, use the preview URL (base64)
            // In production, you'd upload to server first
            onInsert(previewUrl, imageAlt);
            resetForm();
            onOpenChange(false);
        }
    };

    const resetForm = () => {
        setImageUrl('');
        setImageAlt('');
        setUploadFile(null);
        setPreviewUrl('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Insert Image</DialogTitle>
                    <DialogDescription>
                        Add an image to your article with an optional caption.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="url" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="url">From URL</TabsTrigger>
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                    </TabsList>

                    <TabsContent value="url" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="image-url">Image URL</Label>
                            <Input
                                id="image-url"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image-alt-url">Caption (Optional)</Label>
                            <Input
                                id="image-alt-url"
                                placeholder="Describe the image"
                                value={imageAlt}
                                onChange={(e) => setImageAlt(e.target.value)}
                            />
                        </div>

                        {imageUrl && (
                            <div className="border rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="max-w-full h-auto rounded"
                                    onError={(e) => {
                                        e.currentTarget.src = '';
                                        e.currentTarget.alt = 'Failed to load image';
                                    }}
                                />
                            </div>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleInsertUrl} disabled={!imageUrl}>
                                Insert Image
                            </Button>
                        </DialogFooter>
                    </TabsContent>

                    <TabsContent value="upload" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="image-file">Choose Image</Label>
                            <Input
                                id="image-file"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image-alt-upload">Caption (Optional)</Label>
                            <Input
                                id="image-alt-upload"
                                placeholder="Describe the image"
                                value={imageAlt}
                                onChange={(e) => setImageAlt(e.target.value)}
                            />
                        </div>

                        {previewUrl && (
                            <div className="border rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="max-w-full h-auto rounded"
                                />
                            </div>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleInsertUpload} disabled={!previewUrl}>
                                Insert Image
                            </Button>
                        </DialogFooter>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
