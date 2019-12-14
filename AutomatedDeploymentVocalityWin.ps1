Add-Type -AssemblyName System.IO.Compression.FileSystem
write-host "`n  ## Automated Deployment Script for Vocality for Windows ## `n"
### FUNCTIONS

### CONFIGURATION

# nodejs
$version = "12.13.1-x64"
$url = "https://nodejs.org/dist/v12.13.1/node-v$version.msi"

$install_node = $TRUE

# git
$git_url = "https://github.com/git-for-windows/git/releases/download/v2.24.1.windows.2/Git-2.24.1.2-64-bit.exe"
$repo_url = "https://github.com/vocality-org/vocality.git"
$install_git = $TRUE


### require administator rights
write-host "`n----------------------------"
write-host " system requirements checking  "
write-host "----------------------------`n"

### require administator rights

if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
   write-Warning "This setup needs admin permissions. Please run this file as admin."     
   break
}

### nodejs version check

if (Get-Command node -errorAction SilentlyContinue) {
    $current_version = (node -v)
}
 
if ($current_version) {
    write-host "[NODE] nodejs $current_version already installed"
    $confirmation = read-host "[NODE] Are you sure you want to replace this version ? [y/N]"
    if ($confirmation -ne "y") {
        $install_node = $FALSE
        write-host "[NODE] Proceeding with the previously installed nodejs version ..."
    }
    
}

write-host "`n"
if ($install_git) {
    if (Get-Command git -errorAction SilentlyContinue) {
        $git_current_version = (git --version)
    }

    if ($git_current_version) {
        write-host "[GIT] $git_current_version detected. Proceeding ..."
    } else {
        $git_exe = "$PSScriptRoot\git-installer.exe"

        write-host "No git version dectected"

        $download_git = $TRUE
        
        if (Test-Path $git_exe) {
            $confirmation = read-host "Local git install file detected. Do you want to use it ? [Y/n]"
            if ($confirmation -eq "n") {
                $download_git = $FALSE
            }
        }

        if ($download_git) {
            write-host "downloading the git for windows installer"
        
            $start_time = Get-Date
            $wc = New-Object System.Net.WebClient
            $wc.DownloadFile($git_url, $git_exe)
            write-Output "git installer downloaded"
            write-Output "Time taken: $((Get-Date).Subtract($start_time).Seconds) second(s)"
        }
        
        write-host "proceeding with git install ..."
        write-host "running $git_exe"
        start-Process $git_exe -Wait
        write-host "git installation done"
    }
}

if ($install_node) {
    
    ### download nodejs msi file
    # warning : if a node.msi file is already present in the current folder, this script will simply use it
        
    write-host "`n----------------------------"
    write-host "  nodejs msi file retrieving  "
    write-host "----------------------------`n"

    $filename = "node.msi"
    $node_msi = "$PSScriptRoot\$filename"
    
    $download_node = $TRUE

    if (Test-Path $node_msi) {
        $confirmation = read-host "Local $filename file detected. Do you want to use it ? [Y/n]"
        if ($confirmation -eq "n") {
            $download_node = $FALSE
        }
    }

    if ($download_node) {
        write-host "[NODE] downloading nodejs install"
        write-host "url : $url"
        $start_time = Get-Date
        $wc = New-Object System.Net.WebClient
        $wc.DownloadFile($url, $node_msi)
        write-Output "$filename downloaded"
        write-Output "Time taken: $((Get-Date).Subtract($start_time).Seconds) second(s)"
    } else {
        write-host "using the existing node.msi file"
    }

    ### nodejs install

    write-host "`n----------------------------"
    write-host " nodejs installation  "
    write-host "----------------------------`n"

    write-host "[NODE] running $node_msi"
    Start-Process $node_msi -Wait
    
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User") 
    
} else {

    write-host "`n----------------------------"
    write-host "  Download Github Repository  "
    write-host "----------------------------`n"
    $download_repo = $FALSE
    $output_path = "$PSScriptRoot\Vocality"
    if (Test-Path $output_path) {
        $confirmation = read-host "[GITHUB] Local Repository detected. Do you want to use it ? [Y/n]"
        if ($confirmation -eq "n") {
            $download_node = $TRUE
        }
    }

    if($download_repo) {
        mkdir $output_path
        cd $output_path
        git clone $repo_url
        Write-Host "[GITHUB] Successfully Downloaded Repository to $output_path\"
    }
    else {
        write-host "[GITHUB] Proceeding with Local Repository..."
    }
    write-host "`n----------------------------"
    write-host "  Checking Node Modules  "
    write-host "----------------------------`n"
    if(Test-Path "$output_path\node_modules") {
    write-host "[NPM] Node_modules found"
    } else {
    write-host "[NPM] Node_modules not found. Installing..."
        cd $output_path
        npm install
        write-host "[NPM] Node_modules installed"
    }

    ##write-host "`n----------------------------"
    #write-host "  Install Heroku-CLI  "
    #write-host "----------------------------`n"
    #npm install -g heroku
    #write-host "Heroku CLI successfully installed"
}
