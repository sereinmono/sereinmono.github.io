# AC Activator 开发记录

## 写在前面

在上一篇文章中，我实现了能够存储设置、修改设置、承载设置内容的类 `Settings` 和 `SettingInfo`。并且，我设计并实现了一个『设置』页面，允许用户通过 GUI 的方式来便捷地修改 KMS 操作设置，且提到了『 User Is Drunk 』的设计理念。接下来，就即将要实现 AC Activator 最为核心的功能——实现激活。

## 激活的原理

在第一篇文章中，我谈到了要激活需要执行三条命令：

```

slmgr /ipk <product key>
slmgr /skms <kms server>
slmgr /ato
```

三条命令，缺一不可。而我们想要实现的事情也很简单，就是要使用这个 GUI 程序，帮助用户代为执行这三条命令。然而，我们就面临了一个问题：我们固然可以通过创建子进程的方式来实现对于命令的执行，但是『管理员权限』从哪里来？

调整 app.manifest 文件，将

```xaml

<requestedExecutionLevel  level="asInvoker" uiAccess="false" />
```

改为：

```xaml

<requestedExecutionLevel  level="requireAdministrator" uiAccess="false" />
```

**然后，你就会惊讶地发现，这个应用直接『暴毙』了：无法调试、无法运行**。

这个时候，我们会发现这条路根本走不通（我目前也没有搞明白到底是什么状况），现在我们将 app.manifest 修改回原来的模样。

此时我们就需要搬出 PowerShell 了。PowerShell 可以通过 `start-process` 命令实现通过 UAC 申请提升权限。

```

powershell start-process <命令> -verb runAs
```

所以，初步方法：

1. 首先，由程序来创建一个 activate.bat
2. 然后，由程序创建一个 PowerShell 子进程来执行 activate.bat
3. 结束激活

然而，这又会涉及到一个问题：我们在执行激活时，会突然蹦出一个黑乎乎的命令提示符糊你脸上——在这种情况下，你到底执行了什么命令，在用户的视角来说全部都一览无余。另外一方面，『弹出另外的窗口』本身就会增加用户不必要的担忧。在设计应用时，我们追求的是一个『黑箱』：你输入命令并输出结果，并且你不知道黑箱内部发生了什么，表现在开发上来讲，就是不将非必要的信息透露给用户，只提供给用户以结果。你并不想要在日常使用浏览器的时候紧盯着 Console 或是 Network / Source 窗口，相信我，你不会喜欢这样的体验的。

所以，为了隐藏窗口，我们需要依赖于 VBScript。

```vbscript

Set ws = CreateObject("WScript.shell")
ws.Run "cmd start /c {activate.bat绝对路径}", 0
```

通过这种方式，我们就可以实现批处理文件在执行时的窗口隐藏。

所以，我们将这个过程调整为：

1. 首先，由程序来创建一个 activate.bat
2. 然后，创建一个执行 activate.bat 的 launcher.vbs
3. 通过 PowerShell 子进程执行 launcher.vbs
4. 结束激活

## `Activator` 的实现

同 `Settings` 类，我们也将激活的功能单独地分散在一个专门的类中。按照这个过程，我们来实现 Activator.cs 的代码如下：

```c#

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace ACActivator
{
    
    /// <summary>
    /// 这个应用的『心脏』与『灵魂』：激活器。
    /// 根据应用中提供的KMS Url生成两个文件：『launcher.vbs』和『activate.bat』。
    /// 『launcher.vbs』能够实现在不生成新窗口的情况下运行『activate.bat』。
    /// 『activate.bat』通过Windows提供的『slmgr.vbs』完成激活。
    /// </summary>

    internal static class Activator
    {

        readonly static string _localFolderPath = Windows.Storage.ApplicationData.Current.LocalFolder.Path;

        public static void Activate(string KMSUrl)
        {
            string batFilePath = Path.Combine(_localFolderPath, "activate.bat");
            string vbsFilePath = Path.Combine(_localFolderPath, "launcher.vbs");
            File.WriteAllText(batFilePath, $"slmgr /skms {KMSUrl} && slmgr /ato");
            File.WriteAllText(vbsFilePath, $"Set ws = CreateObject(\"WScript.shell\")\nws.Run \"cmd start /c {batFilePath}\",0");
            RunActivate();
        }

        static void RunActivate()
        {            
            string vbsp = Path.Combine(_localFolderPath, "launcher.vbs");
            Process process = new();
            process.StartInfo.FileName = "powershell.exe";
            process.StartInfo.Arguments = $"start-process wscript {vbsp} –verb runAs";
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.CreateNoWindow = true;
            process.Start();
            process.WaitForExit();
            process.Close();
        }
    }
}
```

在 Activator.cs 中定义了一个静态类 `Activator`，这个类用来实现激活的功能。外部程序调用 `Activate()` 来执行激活。在函数 `Activate()` 中，我们创建 activate.bat 和 launcher.vbs。然后，运行 `RunActivate()`，创建一个 PowerShell 的子进程来执行 launcher.vbs。在这之中将 `process.StartInfo.UseShellExcute` 禁用，是因为已经确切了我们要运行什么程序，且清楚运行的是一个程序。将 `process.StartInfo.CreateNoWindow` 启用。是因为我们不想要 PowerShell 创建它的窗口——刚才我们已经提到要对用户塑造一个『黑箱』。

## 主页

接下来我们将 `ActionPage` 的相关功能对接上去。以下是 ActionPage.xaml 以及 ActionPage.xaml.cs 的完整代码：

```xaml

<Page
    x:Class="ACActivator.ActionPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="using:ACActivator"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d"
    Background="{ThemeResource ApplicationPageBackgroundThemeBrush}">

    <Grid Background="{StaticResource acBackgroundBrush}">
        <StackPanel Margin="55,20,20,0" Background="{StaticResource acBackgroundBrush}">

            <!--一些提示。-->

            <InfoBar
                IsOpen="True"
                IsClosable="True"
                Title="危险行为"
                Message="您即将进行的操作涉及到更改该Windows操作系统副本的KMS设置和激活设置。请充分考虑并了解继续操作所涉及到的风险。权限越高，责任越大。"
                Severity="Warning">
                <InfoBar.IconSource>
                    <SymbolIconSource Symbol="Setting" />
                </InfoBar.IconSource>
            </InfoBar>
            
            <InfoBar
                IsOpen="True"
                IsClosable="True"
                Title="法律风险提示"
                Margin="0, 5"
                Message="经过KMS激活后，您可能会成为盗版Windows操作系统的受害者。本程序只是一个带有GUI的KMS操作工具，并不倡导激活盗版操作系统。请不要输入未经Microsoft授权的KMS服务器，否则您将得到一个盗版操作系统。根据您所在地区的法律法规，这可能将使你面临法律风险。出于道德和法律层面考虑，我们建议您支持正版。"
                Closed="InfoBar_Closed"/>

            <InfoBar
                IsOpen="True"
                IsClosable="True"
                Title="支持我们！"
                Margin="0, 1"
                Message="本程序使用热爱作为核心技术。访问托管于Github的项目来给本作品Star。当然，如果发现问题，疑难杂症也可以在这里解决。"
                Severity="Error"
                Closed="InfoBar_Closed">
                <InfoBar.IconSource>
                    <FontIconSource Glyph="&#xEB52;" Foreground="DarkRed"/>
                </InfoBar.IconSource>
                <InfoBar.ActionButton>
                    <HyperlinkButton 
                        Content="看一眼我们的仓库"
                        NavigateUri="https://github.com/sereinmono/ACActivator"
                        Foreground="DarkRed"/>
                </InfoBar.ActionButton>
            </InfoBar>

        </StackPanel>
        
        <Button 
            Margin="0, 0, 20, 20" 
            Style="{StaticResource AccentButtonStyle}" 
            HorizontalAlignment="Right" 
            VerticalAlignment="Bottom" 
            Width="50" 
            Height="50" 
            x:Name="ActionButton">
            <!--激活按钮-->
            <FontIcon FontFamily="{StaticResource SymbolThemeFontFamily}" Glyph="&#xe945;"/>
            <Button.Flyout>
                <!--提醒用户：注意KMS地址-->
                <Flyout>
                    <StackPanel>
                        <TextBlock Style="{ThemeResource BaseTextBlockStyle}" Text="{x:Bind noticeText}" Margin="0,0,0,12" x:Name="ButtonFlyoutText"/>
                        <Button Content="明白，继续" Click="Button_Click"/>
                    </StackPanel>
                </Flyout>
            </Button.Flyout>
            <Button.Resources>
                <!--教程提示-->
                <TeachingTip x:Name="HowToStartTip"
                    Target="{x:Bind ActionButton}"
                    Title="立即开始"
                    Subtitle="只需点击这里然后就可以开始了。"
                    IsOpen="False"/>
            </Button.Resources>
        </Button>
        
    </Grid>
    
</Page>
```



```c#

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Controls.Primitives;
using Microsoft.UI.Xaml.Data;
using Microsoft.UI.Xaml.Input;
using Microsoft.UI.Xaml.Media;
using Microsoft.UI.Xaml.Navigation;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;


namespace ACActivator
{
    /// <summary>
    /// 这是一个操作页，允许用户开始操作，并显示警告和提示等。
    /// </summary>


    public sealed partial class ActionPage : Page
    {
        readonly string noticeText;

        public ActionPage()
        {
            // 在这个方法中，会初始化让用户注意一下KMS Server地址的『noticeText』，并向用户显示指引提示『HowToStartTip』。
            
            noticeText = $"您即将更改Windows激活设置。\n你使用的KMS服务器为：{Settings.ReadSettings().KMSUrl}";
            this.InitializeComponent();
            bool haveTaughtHowToStart = Settings.ReadSettings().haveTaughtHowToStart;
            if (!haveTaughtHowToStart)
            {
                HowToStartTip.IsOpen = true;
                SettingsInfo newInfo = Settings.ReadSettings();
                newInfo.haveTaughtHowToStart = true;
                Settings.WriteSettings(newInfo);
            }
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            // 激活按钮按完之后要干两件事情：『激活』、『提醒用户已经激活』
            
            Activator.Activate(Settings.ReadSettings().KMSUrl);
            ShowDialog();
        }

        private async void ShowDialog()
        {
            // 显示一个提示激活即将完成的弹窗。

            ContentDialog dialog = new()
            {
                Title = "激活即将完成。",
                CloseButtonText = "好的，谢谢",
                Content = "山随平野尽，江入大荒流。\n您可以关闭乃至于卸载该程序。",
                FullSizeDesired = false,
                // 注意：请不要将此行删去！详细说明请见：https://github.com/microsoft/microsoft-ui-xaml/issues/2504
                XamlRoot = this.Content.XamlRoot
            };

            await dialog.ShowAsync();
        }

    }
}
```

至此，这个程序的主要功能就已经实现完毕了。现在当我们运行这个程序的时候，我们可以十分『流畅』地点击右下角的激活按钮，确认 KMS 服务器地址，赋予管理员权限，看到一个『完成激活』的弹窗。有了这个程序的帮助，我们可以在远离命令提示符的情况下『流畅而优雅』地完成这一切。

不过，最后还有一点点要润『色』的地方。

## 实现深色模式

```xaml

<ResourceDictionary.ThemeDictionaries>
    <ResourceDictionary x:Key="Light">
        <SolidColorBrush x:Key="acBackgroundBrush" Color="White"/>
    </ResourceDictionary>
    <ResourceDictionary x:Key="Dark">
        <SolidColorBrush x:Key="acBackgroundBrush" Color="#111111"/>
    </ResourceDictionary>
</ResourceDictionary.ThemeDictionaries>
```

通过定义 `acBackgroundBrush`，我们实现了对于应用背景的神色模式适配。之后，在 SettingPage.xaml 与 ActionPage.xaml 中，我们将 `BackgroundColor` 设定为 `{StaticResource acBackgroundBrush}`即可。

## 最后

最后，我成功实现了一个面向于小白的 KMS 激活工具—— AC Activator。[它的 GitHub 仓库在此处](https://github.com/sereinmono/ACActivator/)。支持的朋友可以来个 Star。该项目会不断完善。WinUI 3 还有一些让人用起来感觉很离谱的地方，例如不支持真正的亚克力效果和云母，标题栏自定义复杂程度令人发指等等。希望使用 WinUI 3 开发新项目的朋友还可以再等一等，再观望观望。