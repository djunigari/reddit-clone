import { useState, ChangeEvent } from "react"

function useSelectFile() {
    const [selectedFile, setSelectedFile] = useState<string>()

    const onSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader()
        if (event.target.files?.[0]) {
            reader.readAsDataURL(event.target.files[0])
        }

        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                setSelectedFile(readerEvent.target.result as string)
            }
        }
    }

    return {
        onSelectFile,
        selectedFile,
        setSelectedFile
    }
}

export default useSelectFile