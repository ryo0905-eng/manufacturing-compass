"""Small supervised segmentation network; no pretrained weights."""
import torch
from torch import nn
from torch.nn import functional as F


def block(inputs, outputs):
    return nn.Sequential(nn.Conv2d(inputs, outputs, 3, padding=1), nn.ReLU(),
                         nn.Conv2d(outputs, outputs, 3, padding=1), nn.ReLU())


class TinyUNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.e1, self.e2, self.center = block(1, 16), block(16, 32), block(32, 64)
        self.d2, self.d1 = block(96, 32), block(48, 16)
        self.output = nn.Conv2d(16, 1, 1)

    def forward(self, pixels):
        a = self.e1(pixels)
        b = self.e2(F.max_pool2d(a, 2))
        c = self.center(F.max_pool2d(b, 2))
        d = self.d2(torch.cat([F.interpolate(c, scale_factor=2, mode="nearest"), b], dim=1))
        e = self.d1(torch.cat([F.interpolate(d, scale_factor=2, mode="nearest"), a], dim=1))
        return self.output(e)


class InferenceModel(nn.Module):
    def __init__(self, model):
        super().__init__()
        self.model = model

    def forward(self, pixels):
        return torch.sigmoid(self.model(pixels))
