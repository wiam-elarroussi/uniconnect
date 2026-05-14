<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ResourceController extends Controller
{
    public function store(Request $request)
    {
        $hasFile = $request->hasFile('file') && $request->file('file')->isValid();
        $hasLink = $request->filled('link');

        $request->validate([
            'title'    => 'required|string|max:100',
            'link'     => $hasFile ? 'nullable|url' : 'required|url',
            'file'     => $hasFile ? 'required|file|max:20480|mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,txt,zip' : 'nullable',
            'category' => 'required|string',
            'filiere'  => 'nullable|string|max:120',
        ]);

        $user = Auth::user();

        $filePath = null;
        $fileName = null;
        $link = $request->link;

        if ($hasFile) {
            $uploaded = $request->file('file');
            $fileName = $uploaded->getClientOriginalName();
            $filePath = $uploaded->store('resources', 'public');
            $link = Storage::url($filePath);
        }

        Resource::create([
            'title'         => $request->title,
            'link'          => $link,
            'file_path'     => $filePath,
            'file_name'     => $fileName,
            'category'      => $request->category,
            'filiere'       => $request->filled('filiere') ? $request->filiere : null,
            'user_id'       => $user->id,
            'university_id' => $user->university_id,
        ]);

        return back()->with('success', 'Ressource ajoutée avec succès !');
    }
}
