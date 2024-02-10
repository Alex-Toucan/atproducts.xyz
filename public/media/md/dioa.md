## Dependency Injection for AvaloniaUI
### Created by our friend @venenjean.
[MammaMiaDev - YouTube](https://www.youtube.com/watch?v=q6lFGr2DeHQ&t=199s)
> Explains some possibilities.

[MammaMiaDev - GitHub](https://github.com/MammaMiaDev/avaloniaui-the-series/blob/main/AvaloniaApplication/App.axaml.cs)
> Example repository for DI in context with Views & ViewModels | `Showing App.xaml.cs`
> => **REQUIRED** : Implement the `RegisterViewFactory` from `ViewLocator.cs`
> Can of course be used for other stuff except Views & ViewModels.
### Setup for Rider
Pre-conditions: Add package source (image1).

**Instructions**
- Source values
 - Name : Windows Community Toolkit Labs (or decide as you want)
 - URL : https://pkgs.dev.azure.com/dotnet/CommunityToolkit/_packaging/CommunityToolkit-Labs/nuget/v3/index.json | **REQUIRED**
 - User : Rider account name
 - Password : Rider account password

> **Background information**
> By this action you are actually modifying the NetGet.config file, which applies configurations to the NuGet package manager on your local machine.

Afterwards install the package from Rider's NuGet Window as usual and you're off to the races. 👍
### Other GitHub Repos
[Official Instructions on adding the Community Toolkit as a NuGet packages source](https://github.com/CommunityToolkit/WindowsCommunityToolkit/wiki/Preview-Packages#toolkit-labs-)
> Instructions are derived from this.

[Create an AOT-friendly ViewLocator](https://github.com/stevemonaco/AvaloniaViewModelFirstDemos?tab=readme-ov-file)
> MammaMiaDev is derived from this.
