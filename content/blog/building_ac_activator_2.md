# AC Activator 开发记录 （二）

## 写在前面

在上一篇文章中，我谈论到了主界面从草稿到实现的过程。现在，我们需要将设置页面编写出来。这个页面允许用户输入自己希望使用的 KMS 地址，并同时允许用户对其他的偏好设置进行调整。由于这还仅仅只是 AC Activator 的第一个版本，所以我只将更改 KMS 服务器的功能加进了设置中。我选择将 KMS 相关设置分散进『设置』页中而非将其一起放在首页，是为了保持简洁性和可用性。比起认为用户是全知全能的、理智的『操作者』，我更愿意相信 **『用户喝多了』** （The User Is Drunk）。这是一种设计哲学，即采取对用户的理智的零预期，尽一切能力将 App 设计成最为简便易用的样子，作为一个开发者，千万不要过于期望用户使用你应用程序的能力有多高，更何况这就是一个面向于小白的程序——应用的『易于使用』是第一个要考虑的。

## 设置前台的实现

![设置页面](/blog/included_image/building_ac_activator_2/settings-page.png)

这是我们要实现的设置页面。这个页面由『常规设置』、『关于』所组成。论代码的话，前台 XAML 的实现很简单：

```xaml
<Page
    x:Class="ACActivator.SettingsPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="using:ACActivator"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d"
    Background="{ThemeResource ApplicationPageBackgroundThemeBrush}">


    <Grid Background="{StaticResource acBackgroundBrush}">
        <RelativePanel Margin="55,20,20,0" Background="{StaticResource acBackgroundBrush}" HorizontalAlignment="Left">
            
            <!--使用RelativePanel的原因：当使用StackPanel时，会意外地出现所有元素居中的情况。-->
            
            <!--提醒用户这里的设置不影响Windows KMS设置。-->
            <InfoBar
                IsOpen="True"
                IsClosable="True"
                Title="注意：这并不更改您的Windows的激活设置。"
                Margin="0, 5"
                Message="更改了这里的KMS地址及其他设置只是更改了本程序中的设置，并非会对您的Windows操作系统的KMS激活设置造成影响。只有当您开始操作后，这里的KMS设置才被注入到您的Windows系统副本中。"
                x:Name="SettingsNotice">
            </InfoBar>

            <!--副标题罢了。-->
            <TextBlock x:Name="CommonSettings" FontSize="20" RelativePanel.Below="SettingsNotice" Margin="0, 5">
                <Bold>常规设置</Bold>
            </TextBlock>

            <!--KMS服务器地址输入框。-->
            <TextBox Header="KMS服务器地址" 
                     PlaceholderText="kms.exam.ple" 
                     Width="300" 
                     x:Name="KMSUrlBox" 
                     TextChanging="KMSUrlBox_TextChanging" 
                     RelativePanel.Below="CommonSettings" 
                     Margin="0, 10" 
                     Text="{x:Bind KMSUrl}"/>

            <!--错误提示语。-->
            <TextBlock Visibility="Collapsed" 
                       x:Name="KMSUrlBoxErrorHintText" 
                       RelativePanel.Below="KMSUrlBox" 
                       RelativePanel.AlignLeftWith="KMSUrlBox" 
                       Padding="0, 10">
                不是一个KMS服务器地址。请不要带有“http://”、“https://”等前缀，并不要带有“/”、“\”等斜杠。
            </TextBlock>

            <!--关于。-->
            <StackPanel RelativePanel.Below="KMSUrlBoxErrorHintText" Margin="0, 15">
                <TextBlock FontSize="20"><Bold>关于</Bold></TextBlock>
                <TextBlock Margin="0, 10">AC Activator 0.1.2</TextBlock>
                <TextBlock>by sereinmono</TextBlock>
                <HyperlinkButton 
                    Content="查看Github上的项目页"
                    NavigateUri="https://github.com/sereinmono/ACActivator" 
                    Margin="0, 10" />
            </StackPanel>
            
        </RelativePanel>
        
        <Button 
            Margin="0, 0, 20, 20" 
            Style="{StaticResource AccentButtonStyle}" 
            HorizontalAlignment="Right" 
            VerticalAlignment="Bottom" 
            Click="SaveButton_Click">
            确定并应用
        </Button>
    </Grid>

</Page>
```

## 后台业务逻辑的实现

### `Settings` 类和 `SettingsInfo` 类

关键在于，我们要如何实现后台的逻辑，设置怎么存储，存储在哪里。

对于一个使用紧凑打包的 Windows 程序来说，MSIX 严格限制了程序对文件的存储。对于我们的程序来说，是**不能把文件直接存在程序所在的文件夹**的。所以，我们将会把 settings.json 存在 AppData 文件夹中。要注意的是，MSIX 具有灵活的虚拟化，你所存入的 AppData 并不是真正的 AppData 文件夹，仅仅只是一个对特定于该用户和该应用的专门位置的映射，也就是一个『桌面桥』。

之前我尝试过将 settings.json 存在应用所工作的文件夹中，结果会出现一个诡异的现象：从编译到运行都十分正常，IDE 无任何提示，生产环境的调试和运行过程中不会出现任何的报错，打包过程一切正常，安装 MSIX 也可以正常进行，**但是在安装后就会闪退**。

为了支持对于设置的读写，我们先来创建『设置』类：

```c#
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace ACActivator
{

    /// <summary>
    /// Settings：设置『类』。它是一个拥有着静态方法的静态类，无法被实例化，里面实现了读取设置数据和写入设置数据的方法。
    /// SettingsInfo：真正存有设置数据的类，非静态，可以被实例化。
    /// 它负责读写『settings.json』。一个序列化的SettingsInfo存入其中，需要读取时再反序列化。
    /// </summary>

    internal static class Settings
    {
        readonly static string strFilePath = Path.Combine(Windows.Storage.ApplicationData.Current.LocalFolder.Path, "settings.json");
        public static SettingsInfo ReadSettings()
        {
            if (File.Exists(strFilePath))
            {
                SettingsInfo info = JsonConvert.DeserializeObject<SettingsInfo>(File.ReadAllText(strFilePath));
                return info;
            }
            else
            {
                SettingsInfo info = new SettingsInfo("kms.03k.org", false);
                WriteSettings(info);
                return info;
            }
        }

        public static void WriteSettings(SettingsInfo info)
        {
            File.WriteAllText(strFilePath, JsonConvert.SerializeObject(info));
        }
    }

    internal class SettingsInfo
    { 
        public string KMSUrl;
        public bool haveTaughtHowToStart;
        public SettingsInfo(string KMSUrl, bool haveTaughtHowToStart)
        {
            this.KMSUrl = KMSUrl;
            this.haveTaughtHowToStart = haveTaughtHowToStart;
        }
    }
}
```

要注意的是，我们在 `ACActivator` 命名空间下创建了两个类：`Settings` 和 `SettingsInfo`。`Settings` 类是一个静态的类，无法被实例化，是一个用来实现对设置的操作的类；`SettingsInfo` 是一个可以被实例化的类，存储设置的内容，可以被序列化或反序列化，可存入 JSON 文件中或从 JSON 文件中读取。

将读写设置的业务逻辑独立于 `SettingsPage` ，并创立单独的类来办这件事情的一大好处就在于能够实现更高的扩展性和复用性，代码也会变得简明而井井有条，不必将整个对设置的读写的业务逻辑捆绑在 `SettingsPage` 上，实现一个这样的『黑箱』也有助于防止在实现 `SettingsPage` 的过程中将经理过多的放在『如何实现设置的读写』一事上，看起来更加『优雅』些。不是吗？

我们会将设置的相关内容存在 AppData 文件夹的 settings.json 文件中，序列化与反序列化的操作由 `NewtonSoft.Json` 代劳。不重复造轮子。

### 实现 `SettingsPage` 的后台逻辑

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
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using System.Text.RegularExpressions;


namespace ACActivator
{
    /// <summary>
    /// 应用的设置页。
    /// </summary>

    public sealed partial class SettingsPage : Page
    {
        string KMSUrl = Settings.ReadSettings().KMSUrl;
        public SettingsPage()
        {
            this.InitializeComponent();
        }

        private void SaveButton_Click(object sender, RoutedEventArgs e)
        {
            // 当确定并保存后，会检查KMS Server地址是否合法（有效），之后显示错误提示或保存。
            
            SettingsInfo info = Settings.ReadSettings();
            info.KMSUrl = KMSUrlBox.Text;

            if (Regex.IsMatch(KMSUrlBox.Text, @"^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$"))
            {
                Settings.WriteSettings(info);
            }
            else
            {
                KMSUrlBoxErrorHintText.Visibility = Visibility.Visible;
            }
        }

        private void KMSUrlBox_TextChanging(TextBox sender, TextBoxTextChangingEventArgs args)
        {
            // 人家都想要改正错误了，提示就不要一直烦着人家了。

            KMSUrlBoxErrorHintText.Visibility = Visibility.Collapsed;
        }
    }
}
```

我们来剖析一下这段代码是如何运行的——首先，当页面被初始化时，我们会预先将 `KMSUrlBox` 中填入当前已有的设置的内容。之后，当用户更改完内容，点击『确定并保存』时，将会首先将 KMS 地址同正则表达式相匹配。如果不匹配，则不保存并显示 `KMSUrlBoxErrorHintText` ，用户开始再次编辑 `KMSUrlBox` 中的内容时，`KMSUrlBoxErrorHintText` 也相应地隐去。如果匹配，就调用 `Settings.WriteSettings(info);` 来存入设置。

## 总结

我在本篇文章中创建了一个独立于操作页的设置页面，包括 `SettingsPage.xaml` 和 `SettingsPage.xmal.cs`，且将和设置修改相关的业务逻辑独立地分散在了 `Settings.cs` 中的 `Settings` 类和 `SettingsInfo` 类中。 

接下来，将会提到这个程序的核心部分——激活，是怎样实现的。