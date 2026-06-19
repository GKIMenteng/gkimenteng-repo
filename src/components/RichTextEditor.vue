<template>
    <div class="rich-text-editor">
        <div class="editor-toolbar btn-toolbar flex-wrap" role="toolbar">
            <div class="btn-group btn-group-sm me-1 mb-1" role="group">
                <button type="button" class="btn btn-outline-secondary" :class="{ active: isActive('bold') }"
                    @click="exec('bold')" title="Bold (Ctrl+B)">
                    <i class="bi bi-type-bold"></i>
                </button>
                <button type="button" class="btn btn-outline-secondary" :class="{ active: isActive('italic') }"
                    @click="exec('italic')" title="Italic (Ctrl+I)">
                    <i class="bi bi-type-italic"></i>
                </button>
            </div>
            <div class="btn-group btn-group-sm me-1 mb-1" role="group">
                <button type="button" class="btn btn-outline-secondary"
                    @click="execList('insertUnorderedList')" title="Bullet List">
                    <i class="bi bi-list-ul"></i>
                </button>
                <button type="button" class="btn btn-outline-secondary"
                    @click="execList('insertOrderedList')" title="Numbered List">
                    <i class="bi bi-list-ol"></i>
                </button>
            </div>
        </div>
        <div ref="editorRef" class="editor-content form-control" contenteditable="true" @input="onInput"
            @keydown="onKeydown" spellcheck="true" :data-placeholder="placeholder"></div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Write your content here...'
    }
})

const emit = defineEmits(['update:modelValue'])

const editorRef = ref(null)
let savedRange = null

const parseHTML = (html) => {
    if (!html) return ''
    // Basic sanitization: strip script tags and event handlers
    return html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/\son\w+="[^"]*"/gi, '')
        .replace(/\son\w+='[^']*'/gi, '')
}

watch(() => props.modelValue, (val) => {
    if (!editorRef.value) return
    const current = editorRef.value.innerHTML
    const expected = parseHTML(val)
    if (current !== expected) {
        editorRef.value.innerHTML = expected || '<p><br></p>'
    }
})

const getHTML = () => {
    if (!editorRef.value) return ''
    return editorRef.value.innerHTML
}

const onInput = () => {
    emit('update:modelValue', getHTML())
}

const saveSelection = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
        savedRange = sel.getRangeAt(0)
    }
}

const restoreSelection = () => {
    if (savedRange) {
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(savedRange)
    }
}

const exec = (command) => {
    editorRef.value?.focus()
    restoreSelection()
    document.execCommand(command, false, null)
    emit('update:modelValue', getHTML())
}

const execList = (command) => {
    editorRef.value?.focus()
    restoreSelection()
    document.execCommand(command, false, null)
    emit('update:modelValue', getHTML())
}

const isActive = (command) => {
    return document.queryCommandState(command)
}

const onKeydown = (e) => {
    if (e.ctrlKey || e.metaKey) {
        let cmd = null
        if (e.key === 'b' || e.key === 'B') cmd = 'bold'
        if (e.key === 'i' || e.key === 'I') cmd = 'italic'
        if (cmd) {
            e.preventDefault()
            exec(cmd)
        }
    }
}

onMounted(() => {
    if (editorRef.value && props.modelValue) {
        editorRef.value.innerHTML = parseHTML(props.modelValue)
    }
    document.addEventListener('selectionchange', saveSelection)
})

onBeforeUnmount(() => {
    document.removeEventListener('selectionchange', saveSelection)
})
</script>

<style scoped>
.rich-text-editor {
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    overflow: hidden;
}

.editor-toolbar {
    background: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    padding: 0.5rem 0.75rem;
}

.editor-content {
    min-height: 160px;
    max-height: 400px;
    overflow-y: auto;
    border: none;
    border-radius: 0;
    padding: 0.75rem 1rem;
    line-height: 1.6;
}

.editor-content:focus {
    box-shadow: none;
    outline: none;
}

.editor-content ul,
.editor-content ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
}

.editor-content p {
    margin: 0.35rem 0;
}

.editor-content:empty::before {
    content: attr(data-placeholder);
    color: #6c757d;
    pointer-events: none;
    display: block;
}
</style>
